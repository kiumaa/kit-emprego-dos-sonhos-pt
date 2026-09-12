#!/usr/bin/env python3
"""
KEDS v3 — Gerador de Entregáveis e Ficheiros Digitais para a OKANDA.
Produz:
1. Três pacotes ZIP independentes para entrega pós-compra pela OKANDA:
   - kit-principal-keds-portugal.zip
   - bump-entrevista-dos-sonhos.zip
   - bump-linkedin-dos-sonhos.zip
2. Manifesto oficial MANIFEST_OKANDA.json com tamanhos e hashes SHA-256.
3. Apenas amostras e referências gratuitas em public/downloads/.
Sem dependências externas — biblioteca padrão de Python.
"""

import hashlib
import io
import json
import os
import re
import shutil
import textwrap
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRIVATE_OUTPUT_DIR = ROOT / "dist" / "deliverables"
PRIVATE_FILES_DIR = PRIVATE_OUTPUT_DIR / "files"
PUBLIC_DOWNLOADS_DIR = ROOT / "public" / "downloads"

PRIVATE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
PRIVATE_FILES_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# DOCX BUILDER (OpenXML com Satoshi e fallbacks)
# ---------------------------------------------------------------------------

class DocxBuilder:
    def __init__(self, title="Documento KEDS", is_cv=False):
        self.title = title
        self.is_cv = is_cv
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
              <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
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
              <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
              <w:sz w:val="22"/>
              <w:color w:val="51515A"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def add_heading_1(self, text):
        color = "0057D9" if not self.is_cv else "1D1D1F"
        border_color = "0057D9" if not self.is_cv else "D2D2D7"
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="340" w:after="120"/>
            <w:pBdr>
              <w:bottom w:val="single" w:sz="8" w:space="4" w:color="{border_color}"/>
            </w:pBdr>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
              <w:b/>
              <w:sz w:val="28"/>
              <w:color w:val="{color}"/>
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
            <w:spacing w:before="220" w:after="80"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
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
              <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
              {b_tag}
              {i_tag}
              <w:sz w:val="22"/>
              <w:color w:val="{color}"/>
            </w:rPr>
            <w:t>{self._escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.paragraphs.append(xml)

    def add_bullet(self, text):
        bullet_color = "0057D9" if not self.is_cv else "51515A"
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="40" w:after="60"/>
            <w:ind w:left="400" w:hanging="200"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
              <w:b/>
              <w:sz w:val="22"/>
              <w:color w:val="{bullet_color}"/>
            </w:rPr>
            <w:t>• </w:t>
          </w:r>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
              <w:sz w:val="22"/>
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
              <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
              <w:i/>
              <w:sz w:val="20"/>
              <w:color w:val="51515A"/>
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
        <w:rFonts w:ascii="Satoshi" w:hAnsi="Satoshi" w:cs="Arial"/>
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
# PDF BUILDER (PDF 1.4 A4 puro com layout editorial e margens 18mm)
# ---------------------------------------------------------------------------

class PdfBuilder:
    def __init__(self, doc_title="Kit Emprego dos Sonhos", is_sample=False):
        self.doc_title = doc_title
        self.is_sample = is_sample
        self.pages = []
        self.current_page_commands = []
        self.y = 780
        self.page_num = 1

    def _ensure_space(self, needed_pt):
        if self.y - needed_pt < 60:
            self._new_page()

    def _new_page(self):
        # Footer
        footer_cmd = f"""
        BT
        /F2 8.5 Tf
        0.32 0.32 0.35 rg
        50 36 Td
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

        # Header rule
        header_cmd = """
        0.88 0.88 0.90 RG
        0.75 w
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
        0.32 0.32 0.35 rg
        50 {self.y} Td
        ({clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y -= 24

    def add_heading(self, text, level=1):
        size = 14 if level == 1 else 12
        spacing = 32 if level == 1 else 22
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

        cmd_bullet = f"""
        BT
        /F1 10 Tf
        0.0 0.34 0.85 rg
        56 {self.y} Td
        (*) Tj
        ET
        """
        self.current_page_commands.append(cmd_bullet)

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
        replacements = {
            '“': '"', '”': '"', '‘': "'", '’': "'", '–': '-', '—': ' - ',
            '€': 'EUR', '•': '*', '…': '...'
        }
        for k, v in replacements.items():
            s = s.replace(k, v)
        s = s.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        return s.encode('latin-1', 'replace').decode('latin-1')

    def save(self, filepath):
        footer_cmd = f"""
        BT
        /F2 8.5 Tf
        0.32 0.32 0.35 rg
        50 36 Td
        (Kit Emprego dos Sonhos - Portugal - {self._clean(self.doc_title)}) Tj
        420 0 Td
        (Pagina {self.page_num}) Tj
        ET
        """
        self.current_page_commands.append(footer_cmd)
        self.pages.append("\n".join(self.current_page_commands))

        total_pages = len(self.pages)
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
# GERADORES DE ENTREGÁVEIS
# ---------------------------------------------------------------------------

def generate_all_files():
    # 1. CV Essencial (DOCX sem marca, 1 coluna)
    d = DocxBuilder("CV Essencial — Modelo", is_cv=True)
    d.add_title("[O TEU NOME COMPLETO]")
    d.add_subtitle("[Cidade, Portugal] · [contacto@email.pt] · [+351 900 000 000] · [linkedin.com/in/perfil]")
    d.add_callout("Instruções: Substitui os campos entre parênteses retos com a tua informação real. Este modelo usa a fonte Satoshi com fallback automático para Arial/Calibri no Word.")
    d.add_heading_1("Perfil Profissional")
    d.add_paragraph("[Breve resumo de 2 a 3 linhas com a tua área de foco, competências-chave e mais-valias práticas para a oportunidade pretendida.]")
    d.add_heading_1("Experiência Profissional")
    d.add_heading_2("[Cargo / Função] — [Nome da Empresa]")
    d.add_paragraph("[Mês/Ano Início] – [Mês/Ano Fim ou Presente] | [Localidade]", italic=True, color="51515A")
    d.add_bullet("[Responsabilidade ou projeto chave desempenhado, com foco em resultados mensuráveis ou tarefas concretas.]")
    d.add_bullet("[Melhoria de processo, suporte operacional ou coordenação de equipa.]")
    d.add_bullet("[Ferramentas ou tecnologias utilizadas na execução diária.]")
    d.add_heading_2("[Cargo Anterior] — [Nome da Empresa Anterior]")
    d.add_paragraph("[Mês/Ano Início] – [Mês/Ano Fim] | [Localidade]", italic=True, color="51515A")
    d.add_bullet("[Ação desenvolvida com impacto no serviço ou na satisfação de clientes.]")
    d.add_bullet("[Apoio administrativo, operacional ou comercial prestado.]")
    d.add_heading_1("Formação e Qualificações")
    d.add_heading_2("[Designação do Curso ou Grau Académico] — [Instituição]")
    d.add_paragraph("[Ano de Conclusão] | [Projetos de destaque ou competências desenvolvidas]", italic=True, color="51515A")
    d.add_heading_1("Competências & Idiomas")
    d.add_bullet("Competências Técnicas: [Ferramenta A, Ferramenta B, Sistema C]")
    d.add_bullet("Idiomas: [Português (Nativo), Inglês (Profissional B2/C1)]")
    d.save(PRIVATE_FILES_DIR / "cv-essencial-modelo.docx")

    # Exemplo fictício Essencial
    d_fict = DocxBuilder("CV Essencial — Exemplo", is_cv=True)
    d_fict.add_title("Inês Exemplo")
    d_fict.add_subtitle("Lisboa, Portugal · ines.exemplo@email.pt · +351 912 345 678 · linkedin.com/in/ines-exemplo")
    d_fict.add_callout("Exemplo editorial fictício para apoio à redação. Não corresponde a dados de clientes reais.")
    d_fict.add_heading_1("Perfil Profissional")
    d_fict.add_paragraph("Assistente de operações com 3 anos de experiência em apoio ao cliente, triagem documental e otimização de fluxos de faturação em PMEs em Portugal.")
    d_fict.add_heading_1("Experiência Profissional")
    d_fict.add_heading_2("Assistente Administrativa e de Atendimento — Empresa Exemplo A Lda.")
    d_fict.add_paragraph("2023 – Presente | Lisboa, Portugal", italic=True, color="51515A")
    d_fict.add_bullet("Atendimento presencial e multicanal a 45+ clientes diários com resolução no primeiro contacto em 90% dos casos.")
    d_fict.add_bullet("Organização e arquivo digital de faturas e notas de encomenda em conformidade com os procedimentos internos.")
    d_fict.add_heading_1("Formação")
    d_fict.add_heading_2("Curso Técnico em Secretariado e Apoio à Gestão — Entidade Exemplo")
    d_fict.add_paragraph("2022 | Concluído com aproveitamento", italic=True, color="51515A")
    d_fict.add_heading_1("Competências")
    d_fict.add_bullet("Software: Microsoft 365 (Word, Excel intermédio, Outlook), Google Sheets")
    d_fict.add_bullet("Idiomas: Português (Nativo), Inglês (Compreensão profissional)")
    d_fict.save(PRIVATE_FILES_DIR / "cv-essencial-exemplo-ficticio.docx")

    # Referência Visual Essencial (PDF)
    p_ref = PdfBuilder("CV Essencial — Referência Visual A4")
    p_ref.add_title("CV Essencial — Guia e Referência Visual")
    p_ref.add_subtitle("Estrutura linear A4 em 1 coluna recomendada para o mercado em Portugal")
    p_ref.add_callout("Este modelo foi desenhado para edição externa no Word ou Docs. Sem dependência de editores online.")
    p_ref.add_heading("Porquê a estrutura em 1 coluna?", level=1)
    p_ref.add_paragraph("No mercado português, os recrutadores valorizam leitura cronológica direta. O modelo Essencial elimina distrações visuais e permite apreender o percurso em 30 segundos.")
    p_ref.add_heading("Secções Obrigatórias do Modelo", level=1)
    p_ref.add_bullet("1. Contactos Profissionais: Telefone direto, email e LinkedIn.")
    p_ref.add_bullet("2. Perfil Objetivo (2 a 3 linhas): Focado na mais-valia prática.")
    p_ref.add_bullet("3. Experiência Profissional Reversa: Com 2 a 4 pontos orientados a tarefas concretas.")
    p_ref.add_bullet("4. Formação: Cursos oficiais, entidade e ano de conclusão.")
    p_ref.add_bullet("5. Competências e Ferramentas: Sem barras percentuais fictícias.")
    p_ref.save(PRIVATE_FILES_DIR / "cv-essencial-referencia.pdf")
    # Copiar também a referência para a pasta pública como amostra gratuita legítima
    shutil.copy2(PRIVATE_FILES_DIR / "cv-essencial-referencia.pdf", PUBLIC_DOWNLOADS_DIR / "cv-essencial-referencia.pdf")

    # 2. CV Moderno (DOCX sem marca)
    d_mod = DocxBuilder("CV Moderno — Modelo", is_cv=True)
    d_mod.add_title("[O TEU NOME COMPLETO]")
    d_mod.add_subtitle("[Fotografia opcional] | [Cidade, Portugal] · [contacto@email.pt] · [+351 900 000 000]")
    d_mod.add_callout("Modelo Moderno com destaque para ferramentas técnicas e impacto. A fotografia é opcional.")
    d_mod.add_heading_1("Resumo de Competências & Perfil")
    d_mod.add_paragraph("[Apresentação sucinta com destaque para competências técnicas, metodologias e objetivos profissionais.]")
    d_mod.add_heading_1("Percurso Profissional")
    d_mod.add_heading_2("[Função Recente] — [Empresa]")
    d_mod.add_paragraph("[Período] | [Localidade]", italic=True, color="51515A")
    d_mod.add_bullet("[Ação principal desenvolvida e ferramentas utilizadas.]")
    d_mod.add_bullet("[Impacto prático na equipa ou nos clientes atendidos.]")
    d_mod.add_heading_1("Educação & Certificações")
    d_mod.add_heading_2("[Curso ou Certificação] — [Entidade]")
    d_mod.add_paragraph("[Ano de Conclusão]", italic=True, color="51515A")
    d_mod.add_heading_1("Stack de Ferramentas")
    d_mod.add_bullet("Ferramentas: [Figma, Excel, ERP, CRM, Trello]")
    d_mod.add_bullet("Idiomas: [Português (Nativo), Inglês (Fluente)]")
    d_mod.save(PRIVATE_FILES_DIR / "cv-moderno-modelo.docx")

    d_mod_fict = DocxBuilder("CV Moderno — Exemplo", is_cv=True)
    d_mod_fict.add_title("Inês Exemplo — Modelo Moderno")
    d_mod_fict.add_subtitle("Porto, Portugal · ines.exemplo@email.pt · +351 920 111 222")
    d_mod_fict.add_callout("Exemplo ilustrativo de preenchimento do modelo Moderno.")
    d_mod_fict.add_heading_1("Perfil Profissional")
    d_mod_fict.add_paragraph("Técnica de apoio operacional com 3 anos de experiência em digitalização de processos e atendimento multicanal.")
    d_mod_fict.add_heading_1("Percurso Profissional")
    d_mod_fict.add_heading_2("Técnica de Apoio ao Cliente — Logística Exemplo Lda.")
    d_mod_fict.add_paragraph("2023 – Presente | Porto, Portugal", italic=True, color="51515A")
    d_mod_fict.add_bullet("Gestão de 60+ tickets diários com taxa de satisfação de 94%.")
    d_mod_fict.add_heading_1("Formação")
    d_mod_fict.add_heading_2("Licenciatura em Gestão de PME (Fictícia) — Instituto Exemplo")
    d_mod_fict.add_paragraph("2019 – 2022", italic=True, color="51515A")
    d_mod_fict.save(PRIVATE_FILES_DIR / "cv-moderno-exemplo-ficticio.docx")

    p_mod_ref = PdfBuilder("CV Moderno — Referência Visual A4")
    p_mod_ref.add_title("CV Moderno — Guia e Referência Visual")
    p_mod_ref.add_subtitle("Estrutura contemporânea equilibrada com espaço para competências digitais")
    p_mod_ref.add_callout("Em Portugal a fotografia não é obrigatória por lei. Se optares por incluir, usa fundo neutro e iluminação suave.")
    p_mod_ref.add_heading("Diferenciais do Modelo Moderno", level=1)
    p_mod_ref.add_paragraph("Indicado para marketing, operações, digital, comércio eletrónico e tecnologia.")
    p_mod_ref.save(PRIVATE_FILES_DIR / "cv-moderno-referencia.pdf")

    # 3. Cartas de Apresentação (DOCX e PDF)
    cartas_text = (ROOT / "content" / "kit" / "cartas.md").read_text(encoding="utf-8")
    sections = cartas_text.split("## ")

    d_cartas = DocxBuilder("Cartas de Apresentação KEDS")
    d_cartas.add_title("Pack de 3 Cartas de Apresentação")
    d_cartas.add_subtitle("Estruturas testadas para o mercado de trabalho em Portugal")
    d_cartas.add_callout("Instruções: Escolhe a carta mais adequada e adapta os campos [entre parênteses retos].")
    for sec in sections[1:]:
        lines = sec.strip().split("\n")
        title = lines[0]
        d_cartas.add_heading_1(title)
        for line in lines[1:]:
            l = line.strip()
            if not l: continue
            if l.startswith("**") and l.endswith("**"): d_cartas.add_paragraph(l.replace("**", ""), bold=True)
            elif l.startswith("-") or l.startswith("•"): d_cartas.add_bullet(l.lstrip("-• "))
            else: d_cartas.add_paragraph(l)
    d_cartas.save(PRIVATE_FILES_DIR / "cartas-de-apresentacao-keds.docx")

    p_cartas = PdfBuilder("Cartas de Apresentação KEDS")
    p_cartas.add_title("Três Estruturas de Carta de Apresentação")
    p_cartas.add_subtitle("Instruções de redação e personalização para empresas em Portugal")
    p_cartas.add_callout("A carta de apresentação deve ser concisa e despertar curiosidade para a leitura do CV.")
    for sec in sections[1:]:
        lines = sec.strip().split("\n")
        p_cartas.add_heading(lines[0], level=1)
        for line in lines[1:]:
            l = line.strip()
            if not l: continue
            if l.startswith("**"): p_cartas.add_paragraph(l.replace("**", ""))
            elif l.startswith("-") or l.startswith("•"): p_cartas.add_bullet(l.lstrip("-• "))
            else: p_cartas.add_paragraph(l)
    p_cartas.save(PRIVATE_FILES_DIR / "cartas-de-apresentacao-keds.pdf")

    # 4. Guia Principal KEDS (10 Lições em PDF)
    p_guia = PdfBuilder("Guia Oficial KEDS Portugal")
    p_guia.add_title("Guia Prático: Prepara a Tua Próxima Candidatura")
    p_guia.add_subtitle("10 Lições Estratégicas para o Mercado de Trabalho em Portugal")
    p_guia.add_callout("Edição Oficial v3.0 · Kit Emprego dos Sonhos Portugal.")
    licoes_meta = json.loads((ROOT / "content" / "kit" / "licoes.json").read_text(encoding="utf-8"))["lessons"]
    for item in licoes_meta:
        lesson_file = ROOT / item["source"]
        if not lesson_file.is_file(): continue
        lines = lesson_file.read_text(encoding="utf-8").strip().split("\n")
        p_guia.add_heading(f"Licao {item['order']}: {item['title']}", level=1)
        for line in lines:
            l = line.strip()
            if not l or l.startswith("# "): continue
            if l.startswith("## "): p_guia.add_heading(l.replace("## ", ""), level=2)
            elif l.startswith("- ") or l.startswith("* "): p_guia.add_bullet(l[2:])
            elif l.startswith("> "): p_guia.add_callout(l[2:])
            else:
                clean_l = re.sub(r'\*\*(.*?)\*\*', r'\1', l)
                clean_l = re.sub(r'\*(.*?)\*', r'\1', clean_l)
                p_guia.add_paragraph(clean_l)
    p_guia.save(PRIVATE_FILES_DIR / "guia-keds-portugal.pdf")

    # Amostra gratuita da Lição 1 em public/downloads/
    p_amostra = PdfBuilder("Amostra Gratuita — Guia KEDS", is_sample=True)
    p_amostra.add_title("Guia KEDS Portugal — Amostra Gratuita")
    p_amostra.add_subtitle("Lição 1: O Mercado de Trabalho em Portugal e Canais de Recrutamento")
    p_amostra.add_callout("Amostra de consulta livre. O Kit completo contém as 10 lições, modelos DOCX, cartas e mensagens.")
    l1_file = ROOT / "content" / "kit" / "licao-01.md"
    if l1_file.is_file():
        for line in l1_file.read_text(encoding="utf-8").strip().split("\n"):
            l = line.strip()
            if not l or l.startswith("# "): continue
            if l.startswith("## "): p_amostra.add_heading(l.replace("## ", ""), level=2)
            elif l.startswith("- "): p_amostra.add_bullet(l[2:])
            elif l.startswith("> "): p_amostra.add_callout(l[2:])
            else:
                clean_l = re.sub(r'\*\*(.*?)\*\*', r'\1', l)
                p_amostra.add_paragraph(clean_l)
    p_amostra.save(PUBLIC_DOWNLOADS_DIR / "amostra-guia-keds.pdf")

    # 5. Mensagens de Candidatura (PDF)
    p_msg = PdfBuilder("10 Mensagens de Candidatura")
    p_msg.add_title("10 Mensagens Prontas de Candidatura")
    p_msg.add_subtitle("Modelos de contacto para LinkedIn e Email")
    p_msg.add_callout("Adapta sempre a mensagem ao contexto da empresa. Nunca envies mensagens em massa sem contexto.")
    mensagens_data = json.loads((ROOT / "content" / "kit" / "mensagens.json").read_text(encoding="utf-8"))["messages"]
    for msg in mensagens_data:
        p_msg.add_heading(f"{msg['id'].upper()} - {msg['title']}", level=1)
        p_msg.add_callout(f"Assunto sugerido: {msg['subject']}")
        for line in msg["body"].split("\n"):
            if line.strip(): p_msg.add_paragraph(line.strip())
    p_msg.save(PRIVATE_FILES_DIR / "mensagens-de-candidatura-keds.pdf")

    # 6. Checklists de Preparação (PDF)
    p_chk = PdfBuilder("Checklists de Preparação")
    p_chk.add_title("Checklists Operacionais de Candidatura")
    p_chk.add_subtitle("Listas de verificação passo a passo para pré-envio")
    p_chk.add_callout("Revê estes pontos antes de submeter qualquer candidatura formal a uma empresa em Portugal.")
    checklists_data = json.loads((ROOT / "content" / "kit" / "checklists.json").read_text(encoding="utf-8"))["checklists"]
    for cl in checklists_data:
        p_chk.add_heading(f"Checklist: {cl['id'].upper()}", level=1)
        for item in cl["items"]:
            p_chk.add_bullet(item)
    p_chk.save(PRIVATE_FILES_DIR / "checklists-preparacao-keds.pdf")

    # 7. 25 Prompts de IA (PDF)
    p_prm = PdfBuilder("25 Instruções de IA")
    p_prm.add_title("25 Prompts Estratégicos de IA para Emprego")
    p_prm.add_subtitle("Instruções testadas para apoio na redação sem inventar experiências")
    p_prm.add_callout("Regra Ética KEDS: Utiliza a IA como copiloto de redação. Nunca submetas qualificações que não possuas.")
    prompts_data = json.loads((ROOT / "content" / "kit" / "prompts.json").read_text(encoding="utf-8"))["prompts"]
    for pr in prompts_data:
        p_prm.add_heading(f"Prompt: {pr['id']}", level=1)
        p_prm.add_callout(pr["text"])
    p_prm.save(PRIVATE_FILES_DIR / "25-prompts-ia-keds.pdf")

    # 8. Plano de 7 Dias (PDF)
    p_pln = PdfBuilder("Plano de Ação de 7 Dias")
    p_pln.add_title("Plano de Ação de 7 Dias")
    p_pln.add_subtitle("Roteiro prático diário para renovar candidaturas")
    p_pln.add_callout("Dedica 45 a 60 minutos por dia a cada etapa do plano.")
    plano_data = json.loads((ROOT / "content" / "kit" / "plano-7-dias.json").read_text(encoding="utf-8"))["days"]
    for d_item in plano_data:
        p_pln.add_heading(f"Dia {d_item['day']}: {d_item['title']}", level=1)
        p_pln.add_paragraph(d_item["task"])
        p_pln.add_callout(f"Lição de apoio recomendada: {d_item['lessonSlug']}")
    p_pln.save(PRIVATE_FILES_DIR / "plano-7-dias-keds.pdf")

    # 9. Organizador de Candidaturas (CSV)
    csv_header = "Empresa,Função,Ligação,Estado,Data de envio,Próximo passo,Data do próximo passo,Notas\n"
    csv_sample = "Exemplo Empresa A,Assistente Operacional,https://exemplo.pt/vaga,Submetido,2026-09-15,Acompanhamento por email,2026-09-22,Candidatura com CV Essencial e Carta 1\n"
    (PRIVATE_FILES_DIR / "organizador-candidaturas.csv").write_text(csv_header + csv_sample, encoding="utf-8")
    print(f"  [CSV]  Gerado: organizador-candidaturas.csv")

    # 10. Bump Entrevista dos Sonhos (PDF)
    entrevista_file = ROOT / "content" / "bumps" / "entrevista.md"
    if entrevista_file.is_file():
        p_ent = PdfBuilder("Entrevista dos Sonhos — Guia e Workbook")
        p_ent.add_title("Entrevista dos Sonhos: Guia + Caderno de Exercícios")
        p_ent.add_subtitle("Prepara exemplos. Organiza respostas. Apresenta o teu valor.")
        p_ent.add_callout("Acelerador Entrevista dos Sonhos · Método STAR e 15 Perguntas Difíceis.")
        for line in entrevista_file.read_text(encoding="utf-8").split("\n"):
            l = line.strip()
            if not l or l.startswith("# "): continue
            if l.startswith("## "): p_ent.add_heading(l.replace("## ", ""), level=1)
            elif l.startswith("### "): p_ent.add_heading(l.replace("### ", ""), level=2)
            elif l.startswith("- ") or l.startswith("* "): p_ent.add_bullet(l[2:])
            elif l.startswith("> "): p_ent.add_callout(l[2:])
            else:
                clean_l = re.sub(r'\*\*(.*?)\*\*', r'\1', l)
                p_ent.add_paragraph(clean_l)
        p_ent.save(PRIVATE_FILES_DIR / "entrevista-dos-sonhos-guia-workbook.pdf")

    # 11. Bump LinkedIn dos Sonhos (PDF)
    linkedin_file = ROOT / "content" / "bumps" / "linkedin.md"
    if linkedin_file.is_file():
        p_lnk = PdfBuilder("LinkedIn dos Sonhos — Guia e Workbook")
        p_lnk.add_title("LinkedIn dos Sonhos: Guia + Caderno de Exercícios")
        p_lnk.add_subtitle("Um perfil claro. Contactos com propósito.")
        p_lnk.add_callout("Acelerador LinkedIn dos Sonhos · Otimização de Perfil e Rotina de Networking.")
        for line in linkedin_file.read_text(encoding="utf-8").split("\n"):
            l = line.strip()
            if not l or l.startswith("# "): continue
            if l.startswith("## "): p_lnk.add_heading(l.replace("## ", ""), level=1)
            elif l.startswith("### "): p_lnk.add_heading(l.replace("### ", ""), level=2)
            elif l.startswith("- ") or l.startswith("* "): p_lnk.add_bullet(l[2:])
            elif l.startswith("> "): p_lnk.add_callout(l[2:])
            else:
                clean_l = re.sub(r'\*\*(.*?)\*\*', r'\1', l)
                p_lnk.add_paragraph(clean_l)
        p_lnk.save(PRIVATE_FILES_DIR / "linkedin-dos-sonhos-guia-workbook.pdf")


# ---------------------------------------------------------------------------
# EMPACOTAMENTO DOS 3 ZIPS INDEPENDENTES E MANIFESTO SHA-256
# ---------------------------------------------------------------------------

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def package_zip(zip_path, files_list):
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in files_list:
            src = PRIVATE_FILES_DIR / f
            if src.is_file():
                zf.write(src, arcname=f)
            else:
                print(f"AVISO: Ficheiro não encontrado para zip: {f}")
    size = zip_path.stat().st_size
    sha = sha256_file(zip_path)
    print(f"  [ZIP]  Gerado pacote: {zip_path.name} ({size} bytes, SHA-256: {sha[:12]}...)")
    return {"sizeBytes": size, "sha256": sha}

def clean_public_downloads():
    # Remove ficheiros pagos que estavam indevidamente em public/downloads
    allowed_public = {"cv-essencial-referencia.pdf", "amostra-guia-keds.pdf"}
    for item in PUBLIC_DOWNLOADS_DIR.iterdir():
        if item.is_file() and item.name not in allowed_public:
            item.unlink()
            print(f"  [LIMPEZA] Removido ficheiro pago de public/downloads: {item.name}")

def main():
    print("=== KEDS v3: Geração de Entregáveis Digitais e Manifesto OKANDA ===")
    generate_all_files()

    print("\nA empacotar os 3 produtos independentes...")
    main_kit_files = [
        "guia-keds-portugal.pdf",
        "cv-essencial-modelo.docx",
        "cv-essencial-exemplo-ficticio.docx",
        "cv-essencial-referencia.pdf",
        "cv-moderno-modelo.docx",
        "cv-moderno-exemplo-ficticio.docx",
        "cv-moderno-referencia.pdf",
        "cartas-de-apresentacao-keds.docx",
        "cartas-de-apresentacao-keds.pdf",
        "mensagens-de-candidatura-keds.pdf",
        "checklists-preparacao-keds.pdf",
        "25-prompts-ia-keds.pdf",
        "plano-7-dias-keds.pdf",
        "organizador-candidaturas.csv"
    ]
    bump_entrevista_files = [
        "entrevista-dos-sonhos-guia-workbook.pdf"
    ]
    bump_linkedin_files = [
        "linkedin-dos-sonhos-guia-workbook.pdf"
    ]

    zip_main = PRIVATE_OUTPUT_DIR / "kit-principal-keds-portugal.zip"
    zip_ent = PRIVATE_OUTPUT_DIR / "bump-entrevista-dos-sonhos.zip"
    zip_lnk = PRIVATE_OUTPUT_DIR / "bump-linkedin-dos-sonhos.zip"

    meta_main = package_zip(zip_main, main_kit_files)
    meta_ent = package_zip(zip_ent, bump_entrevista_files)
    meta_lnk = package_zip(zip_lnk, bump_linkedin_files)

    # Limpar public/downloads
    clean_public_downloads()

    # Gerar Manifesto SHA-256 para OKANDA
    manifest = {
        "version": "3.0",
        "date": "2026-09-12",
        "currency": "EUR",
        "deliveryPlatform": "OKANDA PAY",
        "packages": [
            {
                "id": "kit-principal",
                "productName": "Kit Emprego dos Sonhos — Portugal",
                "priceMinor": 1499,
                "priceFormatted": "14,99 €",
                "zipFileName": "kit-principal-keds-portugal.zip",
                "sizeBytes": meta_main["sizeBytes"],
                "sha256": meta_main["sha256"],
                "contents": [
                    {"file": f, "sha256": sha256_file(PRIVATE_FILES_DIR / f), "sizeBytes": (PRIVATE_FILES_DIR / f).stat().st_size}
                    for f in main_kit_files if (PRIVATE_FILES_DIR / f).is_file()
                ]
            },
            {
                "id": "bump-entrevista",
                "productName": "Entrevista dos Sonhos (Guia + Workbook)",
                "priceMinor": 499,
                "priceFormatted": "+ 4,99 €",
                "zipFileName": "bump-entrevista-dos-sonhos.zip",
                "sizeBytes": meta_ent["sizeBytes"],
                "sha256": meta_ent["sha256"],
                "contents": [
                    {"file": f, "sha256": sha256_file(PRIVATE_FILES_DIR / f), "sizeBytes": (PRIVATE_FILES_DIR / f).stat().st_size}
                    for f in bump_entrevista_files if (PRIVATE_FILES_DIR / f).is_file()
                ]
            },
            {
                "id": "bump-linkedin",
                "productName": "LinkedIn dos Sonhos (Guia + Workbook)",
                "priceMinor": 599,
                "priceFormatted": "+ 5,99 €",
                "zipFileName": "bump-linkedin-dos-sonhos.zip",
                "sizeBytes": meta_lnk["sizeBytes"],
                "sha256": meta_lnk["sha256"],
                "contents": [
                    {"file": f, "sha256": sha256_file(PRIVATE_FILES_DIR / f), "sizeBytes": (PRIVATE_FILES_DIR / f).stat().st_size}
                    for f in bump_linkedin_files if (PRIVATE_FILES_DIR / f).is_file()
                ]
            }
        ],
        "publicSamples": [
            {
                "file": "amostra-guia-keds.pdf",
                "location": "public/downloads/amostra-guia-keds.pdf",
                "sha256": sha256_file(PUBLIC_DOWNLOADS_DIR / "amostra-guia-keds.pdf"),
                "sizeBytes": (PUBLIC_DOWNLOADS_DIR / "amostra-guia-keds.pdf").stat().st_size
            },
            {
                "file": "cv-essencial-referencia.pdf",
                "location": "public/downloads/cv-essencial-referencia.pdf",
                "sha256": sha256_file(PUBLIC_DOWNLOADS_DIR / "cv-essencial-referencia.pdf"),
                "sizeBytes": (PUBLIC_DOWNLOADS_DIR / "cv-essencial-referencia.pdf").stat().st_size
            }
        ]
    }

    manifest_path = PRIVATE_OUTPUT_DIR / "MANIFEST_OKANDA.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n[OK] Manifesto gerado com sucesso: {manifest_path.name}")
    print("=== Concluído ===")

if __name__ == "__main__":
    main()
