#!/usr/bin/env python3
"""
Gera os recursos estáticos finais (DOCX e PDF) de acordo com docs/08_PRODUCAO_RECURSOS.md
e o sistema visual em design/tokens.json.
Sem dependências externas — utiliza exclusivamente a biblioteca padrão de Python.
"""

import io
import json
import os
import re
import sys
import textwrap
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "downloads"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# DOCX BUILDER (OpenXML sem dependências)
# ---------------------------------------------------------------------------

class DocxBuilder:
    def __init__(self, title="Documento KEDS"):
        self.title = title
        self.paragraphs = []

    def add_title(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="240" w:after="160"/>
            <w:jc w:val="left"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:b/>
              <w:sz w:val="44"/>
              <w:color w:val="1D1D1F"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def add_subtitle(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="60" w:after="240"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:sz w:val="24"/>
              <w:color w:val="6E6E73"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def add_heading_1(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="360" w:after="120"/>
            <w:pBdr>
              <w:bottom w:val="single" w:sz="6" w:space="4" w:color="0057D9"/>
            </w:pBdr>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:b/>
              <w:sz w:val="28"/>
              <w:color w:val="0057D9"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def add_heading_2(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="240" w:after="80"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:b/>
              <w:sz w:val="24"/>
              <w:color w:val="1D1D1F"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def add_paragraph(self, text, bold=False, italic=False, color="1D1D1F"):
        b_tag = "<w:b/>" if bold else ""
        i_tag = "<w:i/>" if italic else ""
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="60" w:after="100"/>
            <w:line w:line="276" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              {b_tag}
              {i_tag}
              <w:sz w:val="21"/>
              <w:color w:val="{color}"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def add_bullet(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="40" w:after="60"/>
            <w:ind w:left="400" w:hanging="200"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:b/>
              <w:sz w:val="21"/>
              <w:color w:val="0057D9"/>
            </w:rPr>
            <w:t>• </w:t>
          </w:r>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:sz w:val="21"/>
              <w:color w:val="1D1D1F"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def add_callout(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:pBdr>
              <w:left w:val="single" w:sz="24" w:space="12" w:color="0057D9"/>
            </w:pBdr>
            <w:shd w:val="clear" w:color="auto" w:fill="F5F5F7"/>
            <w:spacing w:before="140" w:after="140"/>
            <w:ind w:left="300" w:right="200"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:i/>
              <w:sz w:val="20"/>
              <w:color w:val="6E6E73"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def _escape(self, text):
        return (
            str(text)
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
        )

    def save(self, filepath):
        buf = io.BytesIO()
        body_content = "\n".join(self.paragraphs)

        document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    {body_content}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>"""

        styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
        <w:sz w:val="22"/>
        <w:color w:val="1D1D1F"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>"""

        content_types_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>"""

        package_rels_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

        doc_rels_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
            z.writestr("[Content_Types].xml", content_types_xml)
            z.writestr("_rels/.rels", package_rels_xml)
            z.writestr("word/_rels/document.xml.rels", doc_rels_xml)
            z.writestr("word/styles.xml", styles_xml)
            z.writestr("word/document.xml", document_xml)

        Path(filepath).write_bytes(buf.getvalue())
        print(f"  [DOCX] Gerado: {Path(filepath).name} ({len(buf.getvalue())} bytes)")


# ---------------------------------------------------------------------------
# PDF BUILDER (PDF 1.4 puro sem dependências externas)
# ---------------------------------------------------------------------------

class PdfBuilder:
    def __init__(self, doc_title="Kit Emprego dos Sonhos"):
        self.doc_title = doc_title
        self.pages = []  # Lista de comandos por página
        self.current_page_commands = []
        self.y = 780
        self.page_num = 1

    def _ensure_space(self, needed_pt):
        if self.y - needed_pt < 60:
            self._new_page()

    def _new_page(self):
        # Footer na página atual
        footer_cmd = f"""
        BT
        /F2 9 Tf
        0.43 0.43 0.45 rg
        50 40 Td
        (Kit Emprego dos Sonhos - Portugal - {self._clean(self.doc_title)}) Tj
        420 0 Td
        (Pagina {self.page_num}) Tj
        ET
        """
        self.current_page_commands.append(footer_cmd)
        self.pages.append("\n".join(self.current_page_commands))

        self.current_page_commands = []
        self.page_num += 1
        self.y = 780

        # Header na nova página
        header_cmd = """
        0.9 0.9 0.92 RG
        1 w
        50 805 m
        545 805 l
        S
        """
        self.current_page_commands.append(header_cmd)

    def add_title(self, text):
        self._ensure_space(60)
        clean = self._clean(text)
        cmd = f"""
        BT
        /F1 20 Tf
        0.11 0.11 0.12 rg
        50 {self.y} Td
        ({clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y -= 28

    def add_subtitle(self, text):
        self._ensure_space(30)
        clean = self._clean(text)
        cmd = f"""
        BT
        /F2 11 Tf
        0.43 0.43 0.45 rg
        50 {self.y} Td
        ({clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y -= 24

    def add_heading(self, text, level=1):
        size = 14 if level == 1 else 12
        spacing = 32 if level == 1 else 24
        self._ensure_space(spacing + 20)
        clean = self._clean(text)

        border = ""
        if level == 1:
            border = f"""
            0.0 0.34 0.85 RG
            1.5 w
            50 {self.y - 4} m
            545 {self.y - 4} l
            S
            """

        cmd = f"""
        {border}
        BT
        /F1 {size} Tf
        {'0.0 0.34 0.85' if level == 1 else '0.11 0.11 0.12'} rg
        50 {self.y} Td
        ({clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y -= (size + 14)

    def add_paragraph(self, text, indent=50):
        lines = textwrap.wrap(str(text), width=82)
        for line in lines:
            self._ensure_space(16)
            clean = self._clean(line)
            cmd = f"""
            BT
            /F2 10 Tf
            0.11 0.11 0.12 rg
            {indent} {self.y} Td
            ({clean}) Tj
            ET
            """
            self.current_page_commands.append(cmd)
            self.y -= 15
        self.y -= 6

    def add_bullet(self, text):
        lines = textwrap.wrap(str(text), width=78)
        if not lines:
            return
        self._ensure_space(16 * len(lines))

        # Bullet symbol
        cmd_bullet = f"""
        BT
        /F1 10 Tf
        0.0 0.34 0.85 rg
        56 {self.y} Td
        (*) Tj
        ET
        """
        self.current_page_commands.append(cmd_bullet)

        # Bullet text
        for i, line in enumerate(lines):
            self._ensure_space(16)
            clean = self._clean(line)
            cmd = f"""
            BT
            /F2 10 Tf
            0.11 0.11 0.12 rg
            70 {self.y} Td
            ({clean}) Tj
            ET
            """
            self.current_page_commands.append(cmd)
            self.y -= 15
        self.y -= 4

    def add_callout(self, text):
        lines = textwrap.wrap(str(text), width=76)
        box_height = len(lines) * 15 + 16
        self._ensure_space(box_height + 12)

        box_y = self.y - box_height + 12
        cmd_box = f"""
        0.96 0.96 0.97 rg
        50 {box_y} 495 {box_height} re
        f
        0.0 0.34 0.85 RG
        3 w
        50 {box_y} m
        50 {box_y + box_height} l
        S
        """
        self.current_page_commands.append(cmd_box)

        text_y = self.y
        for line in lines:
            clean = self._clean(line)
            cmd_text = f"""
            BT
            /F2 9.5 Tf
            0.25 0.25 0.28 rg
            62 {text_y} Td
            ({clean}) Tj
            ET
            """
            self.current_page_commands.append(cmd_text)
            text_y -= 15
        self.y = box_y - 12

    def _clean(self, s):
        # Escape parênteses e caracteres especiais para PDF strings
        # Substitui caracteres fora de latin-1 por equivalentes seguros
        replacements = {
            '“': '"', '”': '"', '‘': "'", '’': "'", '–': '-', '—': ' - ',
            '€': 'EUR', '•': '*', '…': '...'
        }
        for k, v in replacements.items():
            s = s.replace(k, v)
        s = s.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        # Garantir compatibilidade latin-1
        return s.encode('latin-1', 'replace').decode('latin-1')

    def save(self, filepath):
        # Finaliza a última página
        footer_cmd = f"""
        BT
        /F2 9 Tf
        0.43 0.43 0.45 rg
        50 40 Td
        (Kit Emprego dos Sonhos - Portugal - {self._clean(self.doc_title)}) Tj
        420 0 Td
        (Pagina {self.page_num}) Tj
        ET
        """
        self.current_page_commands.append(footer_cmd)
        self.pages.append("\n".join(self.current_page_commands))

        total_pages = len(self.pages)

        # Monta a estrutura de objetos do PDF
        # 1: Catalog
        # 2: Pages root
        # 3..3+total_pages-1: Page objects
        # Fontes: F1 (Bold), F2 (Regular)
        f1_obj = 3 + total_pages * 2
        f2_obj = f1_obj + 1

        objs = {}
        page_obj_ids = []

        for i in range(total_pages):
            page_id = 3 + i * 2
            content_id = page_id + 1
            page_obj_ids.append(page_id)

            stream_bytes = self.pages[i].encode('latin-1')
            stream_len = len(stream_bytes)

            objs[page_id] = f"""<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595 842]
  /Contents {content_id} 0 R
  /Resources <<
    /Font <<
      /F1 {f1_obj} 0 R
      /F2 {f2_obj} 0 R
    >>
  >>
>>"""
            objs[content_id] = f"""<<
  /Length {stream_len}
>>
stream
{self.pages[i]}
endstream"""

        kids_str = " ".join(f"{pid} 0 R" for pid in page_obj_ids)
        objs[1] = f"<< /Type /Catalog /Pages 2 0 R >>"
        objs[2] = f"<< /Type /Pages /Kids [{kids_str}] /Count {total_pages} >>"
        objs[f1_obj] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
        objs[f2_obj] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"

        # Constrói o corpo binário
        body = "%PDF-1.4\n"
        xref = ["0000000000 65535 f \n"]

        total_objs = max(objs.keys())
        for idx in range(1, total_objs + 1):
            offset = len(body.encode('latin-1'))
            xref.append(f"{offset:010d} 00000 n \n")
            body += f"{idx} 0 obj\n{objs[idx]}\nendobj\n"

        xref_offset = len(body.encode('latin-1'))
        body += f"xref\n0 {total_objs + 1}\n" + "".join(xref)
        body += f"trailer\n<< /Size {total_objs + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF"

        Path(filepath).write_bytes(body.encode('latin-1'))
        print(f"  [PDF]  Gerado: {Path(filepath).name} ({total_pages} pag., {len(body)} bytes)")


# ---------------------------------------------------------------------------
# GERADORES DE ENTREGÁVEIS ESPECÍFICOS
# ---------------------------------------------------------------------------

def generate_cv_essencial():
    # 1. DOCX Modelo Vazio
    d = DocxBuilder("CV Essencial — Modelo")
    d.add_title("[O TEU NOME COMPLETO]")
    d.add_subtitle("[Cidade, Portugal] · [contacto@email.pt] · [+351 900 000 000] · [linkedin.com/in/perfil]")
    d.add_callout("Instruções: Substitui os campos entre parênteses retos com a tua informação real. Guarda uma cópia antes de editar.")
    
    d.add_heading_1("Perfil Profissional")
    d.add_paragraph("[Breve resumo de 2 a 3 linhas com a tua área de especialização, foco profissional e principais mais-valias que trazes para a função pretendida.]")
    
    d.add_heading_1("Experiência Profissional")
    d.add_heading_2("[Cargo / Função Pretendida] — [Nome da Empresa]")
    d.add_paragraph("[Mês/Ano Início] – [Mês/Ano Fim ou Presente] | [Localidade]", italic=True, color="6E6E73")
    d.add_bullet("[Responsabilidade ou projeto chave desempenhado, com foco em resultados concretos.]")
    d.add_bullet("[Melhoria, automatização ou processo em que participaste ativamente com a equipa.]")
    d.add_bullet("[Ferramentas ou tecnologias utilizadas no cumprimento das metas da função.]")
    
    d.add_heading_2("[Cargo / Função Anterior] — [Nome da Empresa Anterior]")
    d.add_paragraph("[Mês/Ano Início] – [Mês/Ano Fim] | [Localidade]", italic=True, color="6E6E73")
    d.add_bullet("[Ação desenvolvida com impacto mensurável ou contributo prático comprovável.]")
    d.add_bullet("[Coordenação, gestão ou suporte prestado a clientes, parceiros ou colegas.]")
    
    d.add_heading_1("Formação e Qualificações")
    d.add_heading_2("[Designação do Curso ou Grau Académico] — [Instituição de Ensino]")
    d.add_paragraph("[Ano de Conclusão] | [Classificação ou projetos de destaque, se relevantes]", italic=True, color="6E6E73")
    
    d.add_heading_1("Competências Principais")
    d.add_bullet("Técnicas: [Ferramenta A, Ferramenta B, Sistema C, Metodologia D]")
    d.add_bullet("Operacionais: [Gestão de Prazos, Análise de Informação, Comunicação Interpessoal]")
    d.add_bullet("Idiomas: [Português (Nativo), Inglês (Fluente/Profissional)]")
    
    d.save(OUTPUT_DIR / "cv-essencial-modelo.docx")

    # 2. DOCX Exemplo Fictício (Inês Exemplo)
    d_fict = DocxBuilder("CV Essencial — Exemplo Fictício")
    d_fict.add_title("Inês Exemplo")
    d_fict.add_subtitle("Localidade de exemplo, Portugal · ines@example.com · +351 912 345 678")
    d_fict.add_callout("Exemplo editorial fictício para apoio à redação; não corresponde a dados pessoais reais.")
    
    d_fict.add_heading_1("Perfil Profissional")
    d_fict.add_paragraph("Experiência em apoio administrativo e atendimento ao cliente. Especial foco em organização de pedidos, gestão de documentação e articulação célere com equipas de apoio operacional.")
    
    d_fict.add_heading_1("Experiência Profissional")
    d_fict.add_heading_2("Assistente de Atendimento e Operações — Empresa de Exemplo A")
    d_fict.add_paragraph("2023 – 2025 | Localidade de Exemplo", italic=True, color="6E6E73")
    d_fict.add_bullet("Atendimento presencial e telefónico a mais de 40 utilizadores diários, com resolução de dúvidas e encaminhamento de processos.")
    d_fict.add_bullet("Atualização rigorosa de registos na base de dados interna, garantindo 100% de conformidade documental com os procedimentos da equipa.")
    d_fict.add_bullet("Colaboração direta com a direção de operações na triagem de faturas e preparação de relatórios de atividade semanal.")
    
    d_fict.add_heading_1("Formação")
    d_fict.add_heading_2("Curso Técnico em Apoio Administrativo e Secretariado — Entidade de Exemplo")
    d_fict.add_paragraph("2023 | Concluído com aproveitamento", italic=True, color="6E6E73")
    
    d_fict.add_heading_1("Competências")
    d_fict.add_bullet("Software e Ferramentas: Microsoft Excel, Word, Outlook, Google Workspace, Software de Faturação de Exemplo")
    d_fict.add_bullet("Competências Práticas: Gestão de arquivo, comunicação escrita e telefónica, conciliação de encomendas")
    d_fict.add_bullet("Idiomas: Português (Nativo), Inglês (Compreensão profissional escrita)")
    
    d_fict.save(OUTPUT_DIR / "cv-essencial-exemplo-ficticio.docx")

    # 3. PDF de Referência
    p = PdfBuilder("CV Essencial — Referência Visual A4")
    p.add_title("CV Essencial — Guia e Referência Visual")
    p.add_subtitle("Estrutura linear A4 em 1 coluna recomendada para o mercado português")
    p.add_callout("Este modelo foi desenhado para edição externa no Microsoft Word, Google Docs ou LibreOffice. Sem dependência de editores online ou subscrições.")
    
    p.add_heading("Porquê a estrutura em 1 coluna?", level=1)
    p.add_paragraph("No mercado de trabalho português, os recrutadores e responsáveis de seleção valorizam clareza imediata e cronologia transparente. O modelo Essencial elimina distrações visuais, permitindo que a tua experiência e competências sejam lidas em menos de 30 segundos.")
    
    p.add_heading("Secções Obrigatórias do Modelo", level=1)
    p.add_bullet("1. Nome e Contactos Profissionais: Telefone direto, email profissional e link direto para o LinkedIn.")
    p.add_bullet("2. Perfil Profissional (2-3 linhas): Sem clichês genéricos. Focado naquilo que sabes fazer e no valor para a vaga.")
    p.add_bullet("3. Experiência Profissional Reversa: Começando pela mais recente. Cada experiência deve conter 2 a 4 pontos orientados a tarefas concretas.")
    p.add_bullet("4. Formação: Cursos oficiais, entidades formadoras e ano.")
    p.add_bullet("5. Competências e Idiomas: Listagem prática e realista sem barras percentuais enganadoras.")
    
    p.add_heading("Regras de Ouro antes de Enviar", level=1)
    p.add_bullet("Grava sempre em formato PDF antes de submeter na candidatura.")
    p.add_bullet("Nomeia o ficheiro com o teu nome e função: Exemplo: 'CV-Nome-Apelido-Funcao.pdf'.")
    p.add_bullet("Lê em voz alta para identificar frases demasiado longas ou erros ortográficos.")
    
    p.save(OUTPUT_DIR / "cv-essencial-referencia.pdf")


def generate_cv_moderno():
    # 1. DOCX Modelo Vazio
    d = DocxBuilder("CV Moderno — Modelo")
    d.add_title("[O TEU NOME COMPLETO]")
    d.add_subtitle("[Fotografia opcional removível] | [Cidade, Portugal] · [contacto@email.pt] · [+351 900 000 000]")
    d.add_callout("Modelo Moderno com destaque equilibrado para competências técnicas e impacto. A fotografia é 100% opcional.")
    
    d.add_heading_1("Resumo de Competências & Perfil")
    d.add_paragraph("[Apresentação sucinta com destaque para as tuas competências essenciais, metodologias que dominas e ambição profissional a curto prazo.]")
    
    d.add_heading_1("Destaques & Conquistas Recentes")
    d.add_bullet("[Conquista A: Exemplo de projeto relevante entregue dentro do prazo com impacto comprovável.]")
    d.add_bullet("[Conquista B: Otimização de um processo de trabalho ou adoção de ferramenta de produtividade.]")
    
    d.add_heading_1("Percurso Profissional")
    d.add_heading_2("[Função Recente] — [Organização ou Empresa]")
    d.add_paragraph("[Período] | [Área de Atuação]", italic=True, color="6E6E73")
    d.add_bullet("[Ação principal desenvolvida e tecnologias/ferramentas utilizadas.]")
    d.add_bullet("[Impacto prático na equipa ou nos clientes atendidos.]")
    
    d.add_heading_2("[Função Anterior] — [Organização ou Empresa]")
    d.add_paragraph("[Período] | [Área de Atuação]", italic=True, color="6E6E73")
    d.add_bullet("[Responsabilidades chave e evolução de funções dentro da entidade.]")
    
    d.add_heading_1("Formação Académica e Certificações")
    d.add_heading_2("[Curso / Certificação Profissional] — [Entidade]")
    d.add_paragraph("[Ano] | [Competências validadas]", italic=True, color="6E6E73")
    
    d.add_heading_1("Stack de Ferramentas & Línguas")
    d.add_bullet("Ferramentas: [Figma, Excel Avançado, CRM, ERP, Notion, Trello, etc.]")
    d.add_bullet("Idiomas: [Português (Nativo), Inglês (Profissional C1), Espanhol (Básico)]")
    
    d.save(OUTPUT_DIR / "cv-moderno-modelo.docx")

    # 2. DOCX Exemplo Fictício
    d_fict = DocxBuilder("CV Moderno — Exemplo Fictício")
    d_fict.add_title("Inês Exemplo — Moderno")
    d_fict.add_subtitle("Porto, Portugal · ines.exemplo@email.pt · +351 920 111 222 · linkedin.com/in/ines-exemplo")
    d_fict.add_callout("Exemplo ilustrativo de preenchimento do modelo Moderno.")
    
    d_fict.add_heading_1("Perfil Profissional")
    d_fict.add_paragraph("Profissional de apoio operacional com 3 anos de experiência em digitalização de processos, apoio ao cliente multicanal e coordenação logística em empresas de média dimensão.")
    
    d_fict.add_heading_1("Percurso Profissional")
    d_fict.add_heading_2("Técnica de Operações e Apoio ao Cliente — Logística Exemplo Lda.")
    d_fict.add_paragraph("Jan 2023 – Presente | Porto, Portugal", italic=True, color="6E6E73")
    d_fict.add_bullet("Gestão diária de 60+ ocorrências de entregas com taxa de resolução no primeiro contacto superior a 92%.")
    d_fict.add_bullet("Transição do controlo manual em papel para ferramenta digital de ticketing, reduzindo tempos de resposta em 30%.")
    
    d_fict.add_heading_1("Educação & Formação")
    d_fict.add_heading_2("Licenciatura em Gestão de PME (Fictícia) — Instituto Superior de Exemplo")
    d_fict.add_paragraph("2019 – 2022 | Média de 15 valores", italic=True, color="6E6E73")
    
    d_fict.add_heading_1("Ferramentas & Idiomas")
    d_fict.add_bullet("Ferramentas: Zendesk, Jira, Microsoft 365 (Excel intermédio), Slack, Google Sheets")
    d_fict.add_bullet("Idiomas: Português (Nativo), Inglês (B2 Independente)")
    
    d_fict.save(OUTPUT_DIR / "cv-moderno-exemplo-ficticio.docx")

    # 3. PDF de Referência
    p = PdfBuilder("CV Moderno — Referência Visual A4")
    p.add_title("CV Moderno — Guia e Referência Visual")
    p.add_subtitle("Estrutura contemporânea equilibrada com espaço para competências digitais")
    p.add_callout("Dica: Em Portugal, a inclusão de fotografia não é obrigatória por lei. Se optares por incluir, usa uma foto profissional com fundo neutro e boa iluminação.")
    
    p.add_heading("Diferenças do Modelo Moderno", level=1)
    p.add_paragraph("O modelo Moderno destaca o teu conjunto de ferramentas e conquistas de forma mais dinâmica, sendo particularmente indicado para funções ligadas a marketing, tecnologia, operações, atendimento digital e gestão de projetos.")
    
    p.add_heading("Recomendações de Paginação", level=1)
    p.add_bullet("Para profissionais até 5 anos de experiência: 1 página A4 bem aproveitada é suficiente.")
    p.add_bullet("Para percursos superiores a 5 anos: máximo de 2 páginas A4.")
    p.add_bullet("Não reduzas o tamanho da letra abaixo de 10pt apenas para fazer caber mais texto.")
    
    p.save(OUTPUT_DIR / "cv-moderno-referencia.pdf")


def generate_cartas():
    # DOCX Pack com 3 Cartas
    d = DocxBuilder("Cartas de Apresentação KEDS")
    d.add_title("Pack de 3 Cartas de Apresentação")
    d.add_subtitle("Estruturas testadas para o mercado português de trabalho")
    d.add_callout("Instruções: Escolhe a carta mais adequada ao teu momento profissional e adapta os campos [entre parênteses retos].")

    cartas_text = (ROOT / "content" / "kit" / "cartas.md").read_text(encoding="utf-8")
    sections = cartas_text.split("## ")
    
    for sec in sections[1:]:
        lines = sec.strip().split("\n")
        title = lines[0]
        content_lines = lines[1:]
        
        d.add_heading_1(title)
        for line in content_lines:
            line_str = line.strip()
            if not line_str:
                continue
            if line_str.startswith("**") and line_str.endswith("**"):
                d.add_paragraph(line_str.replace("**", ""), bold=True)
            elif line_str.startswith("•") or line_str.startswith("-"):
                d.add_bullet(line_str.lstrip("•- "))
            else:
                d.add_paragraph(line_str)

    d.save(OUTPUT_DIR / "cartas-de-apresentacao-keds.docx")

    # PDF das Cartas
    p = PdfBuilder("Cartas de Apresentação — Guia e Modelos")
    p.add_title("Três Estruturas de Carta de Apresentação")
    p.add_subtitle("Instruções de redação e personalização para empresas em Portugal")
    p.add_callout("Atenção: A carta de apresentação deve ser sempre mais concisa do que o CV. O objetivo é criar curiosidade para a entrevista.")

    for sec in sections[1:]:
        lines = sec.strip().split("\n")
        title = lines[0]
        content_lines = lines[1:]
        
        p.add_heading(title, level=1)
        for line in content_lines:
            line_str = line.strip()
            if not line_str:
                continue
            if line_str.startswith("**"):
                p.add_paragraph(line_str.replace("**", ""))
            elif line_str.startswith("-") or line_str.startswith("•"):
                p.add_bullet(line_str.lstrip("•- "))
            else:
                p.add_paragraph(line_str)

    p.save(OUTPUT_DIR / "cartas-de-apresentacao-keds.pdf")


def generate_guia_pdf():
    p = PdfBuilder("Guia Emprego dos Sonhos")
    p.add_title("Guia Completo — Emprego dos Sonhos")
    p.add_subtitle("10 Lições Estratégicas para Conseguir Trabalho em Portugal")
    p.add_callout("Edição 2.0 Oficial · Conteúdo editorial protegido do Kit Emprego dos Sonhos Portugal.")

    licoes_meta = json.loads((ROOT / "content" / "kit" / "licoes.json").read_text(encoding="utf-8"))["lessons"]

    for item in licoes_meta:
        lesson_file = ROOT / item["source"]
        if not lesson_file.is_file():
            continue
        lesson_md = lesson_file.read_text(encoding="utf-8")
        lines = lesson_md.strip().split("\n")

        # Título da Lição
        p.add_heading(f"Licao {item['order']}: {item['title']}", level=1)

        for line in lines:
            line_str = line.strip()
            if not line_str or line_str.startswith("# "):
                continue
            if line_str.startswith("## "):
                p.add_heading(line_str.replace("## ", ""), level=2)
            elif line_str.startswith("- ") or line_str.startswith("* "):
                p.add_bullet(line_str[2:])
            elif line_str.startswith("> "):
                p.add_callout(line_str[2:])
            else:
                clean_line = re.sub(r'\*\*(.*?)\*\*', r'\1', line_str)
                clean_line = re.sub(r'\*(.*?)\*', r'\1', clean_line)
                p.add_paragraph(clean_line)

    p.save(OUTPUT_DIR / "guia-keds-portugal.pdf")


def generate_mensagens_pdf():
    p = PdfBuilder("10 Mensagens de Candidatura")
    p.add_title("10 Mensagens Prontas de Candidatura")
    p.add_subtitle("Modelos de contacto direto para LinkedIn, Email e Acompanhamento")
    p.add_callout("Adapta sempre a mensagem ao contexto da pessoa contactada. Nunca envies a mesma mensagem em massa sem personalizacao minima.")

    mensagens_data = json.loads((ROOT / "content" / "kit" / "mensagens.json").read_text(encoding="utf-8"))["messages"]

    for msg in mensagens_data:
        p.add_heading(f"{msg['id'].upper()} - {msg['title']}", level=1)
        p.add_callout(f"Assunto sugerido: {msg['subject']}")
        for line in msg["body"].split("\n"):
            line_str = line.strip()
            if line_str:
                p.add_paragraph(line_str)

    p.save(OUTPUT_DIR / "mensagens-de-candidatura-keds.pdf")


def generate_checklists_pdf():
    p = PdfBuilder("Checklists de Preparacao")
    p.add_title("Checklists Operacionais de Candidatura")
    p.add_subtitle("Listas de verificacao passo a passo para nao falhar nenhum detalhe")
    p.add_callout("Reve estes pontos antes de submeter qualquer candidatura formal a uma empresa.")

    checklists_data = json.loads((ROOT / "content" / "kit" / "checklists.json").read_text(encoding="utf-8"))["checklists"]

    for cl in checklists_data:
        p.add_heading(f"Checklist: {cl['id'].upper()}", level=1)
        for item in cl["items"]:
            p.add_bullet(item)

    p.save(OUTPUT_DIR / "checklists-preparacao-keds.pdf")


def generate_prompts_pdf():
    p = PdfBuilder("25 Instrucoes de IA")
    p.add_title("25 Prompts Estrategicos de IA para Emprego")
    p.add_subtitle("Instrucoes testadas para ChatGPT, Claude e Copilot sem inventar experiencia")
    p.add_callout("Regra Etica KEDS: Utiliza a IA como espelho e copiloto de redacao. Nunca submetas textos ou competencias que nao possuas na realidade.")

    prompts_data = json.loads((ROOT / "content" / "kit" / "prompts.json").read_text(encoding="utf-8"))["prompts"]

    for pr in prompts_data:
        p.add_heading(f"Prompt: {pr['id']}", level=1)
        p.add_callout(pr["text"])

    p.save(OUTPUT_DIR / "25-prompts-ia-keds.pdf")


def generate_plano_pdf():
    p = PdfBuilder("Plano de 7 Dias")
    p.add_title("Plano de Acao de 7 Dias")
    p.add_subtitle("Roteiro pratico diario para renovar candidaturas e ter entrevistas agendadas")
    p.add_callout("Dedica 45 a 60 minutos por dia a cada uma das etapas do plano.")

    plano_data = json.loads((ROOT / "content" / "kit" / "plano-7-dias.json").read_text(encoding="utf-8"))["days"]

    for d in plano_data:
        p.add_heading(f"Dia {d['day']}: {d['title']}", level=1)
        p.add_paragraph(d["task"])
        p.add_callout(f"Licao de apoio recomendada: {d['lessonSlug']}")

    p.save(OUTPUT_DIR / "plano-7-dias-keds.pdf")


def generate_bumps_pdf():
    # Entrevista
    entrevista_file = ROOT / "content" / "bumps" / "entrevista.md"
    if entrevista_file.is_file():
        p = PdfBuilder("Entrevista dos Sonhos — Guia e Workbook")
        p.add_title("Entrevista dos Sonhos — Guia & Workbook")
        p.add_subtitle("Método STAR e 15 Perguntas Difíceis em Entrevistas em Portugal")
        p.add_callout("Conteúdo do Acelerador de Entrevistas KEDS.")
        
        lines = entrevista_file.read_text(encoding="utf-8").split("\n")
        for line in lines:
            line_str = line.strip()
            if not line_str or line_str.startswith("# "):
                continue
            if line_str.startswith("## "):
                p.add_heading(line_str.replace("## ", ""), level=1)
            elif line_str.startswith("### "):
                p.add_heading(line_str.replace("### ", ""), level=2)
            elif line_str.startswith("- ") or line_str.startswith("* "):
                p.add_bullet(line_str[2:])
            elif line_str.startswith("> "):
                p.add_callout(line_str[2:])
            else:
                clean = re.sub(r'\*\*(.*?)\*\*', r'\1', line_str)
                p.add_paragraph(clean)
        p.save(OUTPUT_DIR / "entrevista-dos-sonhos-guia-workbook.pdf")

    # LinkedIn
    linkedin_file = ROOT / "content" / "bumps" / "linkedin.md"
    if linkedin_file.is_file():
        p = PdfBuilder("LinkedIn dos Sonhos — Guia e Workbook")
        p.add_title("LinkedIn dos Sonhos — Guia & Workbook")
        p.add_subtitle("Otimização de Perfil, Título Magnético e Rotina Semanal de Networking")
        p.add_callout("Conteúdo do Acelerador LinkedIn KEDS.")
        
        lines = linkedin_file.read_text(encoding="utf-8").split("\n")
        for line in lines:
            line_str = line.strip()
            if not line_str or line_str.startswith("# "):
                continue
            if line_str.startswith("## "):
                p.add_heading(line_str.replace("## ", ""), level=1)
            elif line_str.startswith("### "):
                p.add_heading(line_str.replace("### ", ""), level=2)
            elif line_str.startswith("- ") or line_str.startswith("* "):
                p.add_bullet(line_str[2:])
            elif line_str.startswith("> "):
                p.add_callout(line_str[2:])
            else:
                clean = re.sub(r'\*\*(.*?)\*\*', r'\1', line_str)
                p.add_paragraph(clean)
        p.save(OUTPUT_DIR / "linkedin-dos-sonhos-guia-workbook.pdf")


def main():
    print("A iniciar geração de recursos estáticos finais...")
    generate_cv_essencial()
    generate_cv_moderno()
    generate_cartas()
    generate_guia_pdf()
    generate_mensagens_pdf()
    generate_checklists_pdf()
    generate_prompts_pdf()
    generate_plano_pdf()
    generate_bumps_pdf()
    print("Todos os recursos estáticos foram gerados com sucesso!")

if __name__ == "__main__":
    main()
