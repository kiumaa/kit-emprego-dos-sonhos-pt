#!/usr/bin/env python3
"""
KEDS v3/v5 — Gerador de Entregáveis e Ficheiros Digitais de Alta Fidelidade para a OKANDA.
Produz:
1. Três pacotes ZIP independentes para entrega pós-compra pela OKANDA:
   - kit-principal-keds-portugal.zip (14 ficheiros)
   - bump-entrevista-dos-sonhos.zip (Guia + Caderno de Exercícios)
   - bump-linkedin-dos-sonhos.zip (Guia + Caderno de Exercícios)
2. Manifesto oficial MANIFEST_OKANDA.json com tamanhos e hashes SHA-256.
3. Apenas amostras e referências gratuitas em public/downloads/.
Design Editorial Apple-inspired: Satoshi/Helvetica, cores KEDS (#0057D9, #1D1D1F, #F5F5F7),
WinAnsiEncoding com suporte 100% nativo a caracteres em português, diagramas vetoriais,
tabelas estilizadas, caixas de chamada multifunções e cadernos de exercícios estruturados.
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
            <w:spacing w:before="260" w:after="140"/>
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
            <w:spacing w:before="40" w:after="220"/>
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
            <w:spacing w:before="320" w:after="120"/>
            <w:pBdr>
              <w:bottom w:val="single" w:sz="10" w:space="6" w:color="{border_color}"/>
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
            <w:spacing w:before="200" w:after="80"/>
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

    def add_callout(self, text, variant="info"):
        border_c = "0057D9" if variant == "info" else ("D97706" if variant == "warning" else "059669")
        fill_c = "F5F5F7" if variant == "info" else ("FFFBEB" if variant == "warning" else "ECFDF5")
        xml = f"""
        <w:p>
          <w:pPr>
            <w:pBdr>
              <w:left w:val="single" w:sz="24" w:space="12" w:color="{border_c}"/>
            </w:pBdr>
            <w:shd w:val="clear" w:color="auto" w:fill="{fill_c}"/>
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
# PDF BUILDER DE LUXO (WinAnsiEncoding com Suporte Nativo a Português)
# ---------------------------------------------------------------------------

class PdfBuilder:
    def __init__(self, doc_title="Kit Emprego dos Sonhos", is_sample=False):
        self.doc_title = doc_title
        self.is_sample = is_sample
        self.pages = []
        self.current_page_commands = []
        self.y = 780
        self.page_num = 1
        self.has_cover = False

    def _clean(self, s):
        """Converte string Unicode para representação de escape PostScript WinAnsi / CP1252."""
        if not s:
            return ""
        replacements = {
            '“': '"', '”': '"', '‘': "'", '’': "'",
            '…': '...', '–': '–', '—': '—', '•': '•', '€': '€'
        }
        for k, v in replacements.items():
            s = s.replace(k, v)
        encoded = s.encode('cp1252', 'replace')
        out = []
        for b in encoded:
            if b == ord('('):
                out.append(r'\(')
            elif b == ord(')'):
                out.append(r'\)')
            elif b == ord('\\'):
                out.append(r'\\')
            elif b >= 128:
                out.append(f"\\{b:03o}")
            else:
                out.append(chr(b))
        return "".join(out)

    def _ensure_space(self, needed_pt):
        if self.y - needed_pt < 65:
            self._new_page()

    def _new_page(self):
        # Fechar página atual com rodapé se não for capa
        if not (self.has_cover and self.page_num == 1):
            footer_cmd = f"""
            BT
            /F2 8.5 Tf
            0.32 0.32 0.35 rg
            50 36 Td
            (Kit Emprego dos Sonhos \226 Portugal \226 {self._clean(self.doc_title)}) Tj
            420 0 Td
            (P\341gina {self.page_num}) Tj
            ET
            """
            self.current_page_commands.append(footer_cmd)

        self.pages.append("\n".join(self.current_page_commands))
        self.current_page_commands = []
        self.page_num += 1
        self.y = 780

        # Cabeçalho da nova página
        header_cmd = f"""
        0.88 0.88 0.90 RG
        0.75 w
        50 805 m
        545 805 l
        S
        BT
        /F3 8 Tf
        0.50 0.50 0.55 rg
        50 812 Td
        (KIT EMPREGO DOS SONHOS \226 GUIA PR\301TICO DE CANDIDATURA) Tj
        ET
        """
        self.current_page_commands.append(header_cmd)

    def add_cover_page(self, title, subtitle, badge="EDIÇÃO OFICIAL · PORTUGAL", meta_items=None):
        """Desenha uma capa editorial premium estilo Apple com proporção harmónica."""
        self.has_cover = True
        badge_clean = self._clean(badge)
        title_clean = self._clean(title)
        subtitle_clean = self._clean(subtitle)

        # Fundo geral e badge de topo
        cmd = f"""
        % Fundo suave no topo
        0.97 0.97 0.98 rg
        50 720 495 50 re
        f
        % Crachá de categoria (Pill Badge)
        0.93 0.95 1.0 rg
        50 728 240 24 re
        f
        0.0 0.34 0.85 RG
        1 w
        50 728 240 24 re
        S
        BT
        /F1 9 Tf
        0.0 0.34 0.85 rg
        62 735 Td
        ({badge_clean}) Tj
        ET

        % Barra de destaque de marca KEDS
        0.0 0.34 0.85 rg
        50 670 90 5 re
        f
        """
        self.current_page_commands.append(cmd)

        # Título principal
        title_lines = textwrap.wrap(title, width=32)
        ty = 635
        for tline in title_lines:
            tline_c = self._clean(tline)
            cmd_t = f"""
            BT
            /F1 26 Tf
            0.11 0.11 0.12 rg
            50 {ty} Td
            ({tline_c}) Tj
            ET
            """
            self.current_page_commands.append(cmd_t)
            ty -= 32

        # Subtítulo
        sub_lines = textwrap.wrap(subtitle, width=54)
        ty -= 8
        for sline in sub_lines:
            sline_c = self._clean(sline)
            cmd_s = f"""
            BT
            /F2 12 Tf
            0.32 0.32 0.35 rg
            50 {ty} Td
            ({sline_c}) Tj
            ET
            """
            self.current_page_commands.append(cmd_s)
            ty -= 18

        # Caixa de Metadados / Resumo Estratégico
        card_y = ty - 180
        cmd_card = f"""
        % Caixa de especificações técnicas
        0.96 0.96 0.97 rg
        50 {card_y} 495 145 re
        f
        0.88 0.88 0.90 RG
        1 w
        50 {card_y} 495 145 re
        S
        BT
        /F1 11 Tf
        0.11 0.11 0.12 rg
        70 {card_y + 115} Td
        (INFORMA\307\303O DO ENTREG\301VEL) Tj
        ET
        """
        self.current_page_commands.append(cmd_card)

        items = meta_items or [
            ("Mercado Alvo", "Portugal (Empresas Locais e Multinacionais)"),
            ("Âmbito Prático", "Estratégia, Ferramentas e Exemplos Reais"),
            ("Metodologia", "Foco em Impacto, Sem Falsas Promessas"),
            ("Versão Oficial", "v3.0 Oficial · Licença Pessoal")
        ]

        item_y = card_y + 88
        for label, val in items:
            l_c = self._clean(label)
            v_c = self._clean(val)
            cmd_item = f"""
            BT
            /F1 9.5 Tf
            0.0 0.34 0.85 rg
            70 {item_y} Td
            ({l_c}:) Tj
            /F2 9.5 Tf
            0.20 0.20 0.22 rg
            160 0 Td
            ({v_c}) Tj
            ET
            """
            self.current_page_commands.append(cmd_item)
            item_y -= 22

        # Selo de Qualidade / Rodapé da Capa
        stamp_cmd = f"""
        0.88 0.88 0.90 RG
        0.75 w
        50 80 m
        545 80 l
        S
        BT
        /F3 9 Tf
        0.45 0.45 0.50 rg
        50 62 Td
        (KIT EMPREGO DOS SONHOS \226 RIGOR E APLICA\307\303O PR\301TICA \226 USO PESSOAL EXCLUSIVO) Tj
        ET
        """
        self.current_page_commands.append(stamp_cmd)

        # Avança para a página seguinte com conteúdo
        self._new_page()

    def add_title(self, text):
        self._ensure_space(55)
        clean = self._clean(text)
        cmd = f"""
        BT
        /F1 19 Tf
        0.11 0.11 0.12 rg
        50 {self.y} Td
        ({clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y -= 26

    def add_subtitle(self, text):
        self._ensure_space(30)
        clean = self._clean(text)
        cmd = f"""
        BT
        /F3 10.5 Tf
        0.32 0.32 0.35 rg
        50 {self.y} Td
        ({clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y -= 22

    def add_heading(self, text, level=1):
        size = 13.5 if level == 1 else (11.5 if level == 2 else 10)
        spacing = 30 if level == 1 else (20 if level == 2 else 16)
        self._ensure_space(spacing + 24)
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

        font = "/F1" if level <= 2 else "/F4"
        color = "0.0 0.34 0.85" if level == 1 else "0.11 0.11 0.12"

        cmd = f"""
        {border}
        BT
        {font} {size} Tf
        {color} rg
        50 {self.y} Td
        ({clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y -= (size + 13)

    def add_paragraph(self, text, bold=False, italic=False, indent=50):
        lines = textwrap.wrap(str(text), width=82)
        font = "/F1" if bold else ("/F3" if italic else "/F2")
        for line in lines:
            self._ensure_space(16)
            clean = self._clean(line)
            cmd = f"""
            BT
            {font} 10 Tf
            0.11 0.11 0.12 rg
            {indent} {self.y} Td
            ({clean}) Tj
            ET
            """
            self.current_page_commands.append(cmd)
            self.y -= 15
        self.y -= 5

    def add_bullet(self, text, bullet_char="•"):
        lines = textwrap.wrap(str(text), width=78)
        if not lines:
            return
        self._ensure_space(16 * len(lines) + 6)

        bullet_clean = self._clean(bullet_char)
        cmd_bullet = f"""
        BT
        /F1 10 Tf
        0.0 0.34 0.85 rg
        54 {self.y} Td
        ({bullet_clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd_bullet)

        for line in lines:
            clean = self._clean(line)
            cmd = f"""
            BT
            /F2 10 Tf
            0.11 0.11 0.12 rg
            68 {self.y} Td
            ({clean}) Tj
            ET
            """
            self.current_page_commands.append(cmd)
            self.y -= 15
        self.y -= 4

    def add_callout(self, text, title=None, variant="info"):
        """Caixa de chamada profissional: info (azul), warning (âmbar) ou success (esmeralda)."""
        lines = textwrap.wrap(str(text), width=76)
        extra_h = 16 if title else 0
        box_height = len(lines) * 14.5 + 16 + extra_h
        self._ensure_space(box_height + 14)

        box_y = self.y - box_height + 12

        # Cores por variante
        if variant == "warning":
            bg_rg = "1.0 0.98 0.92"      # âmbar suave
            border_rg = "0.85 0.47 0.02"  # âmbar escuro
            title_text = title or "ALERTA DO RECRUTADOR"
            t_color = "0.70 0.35 0.01"
        elif variant == "success":
            bg_rg = "0.92 0.99 0.96"      # esmeralda suave
            border_rg = "0.02 0.59 0.41"  # esmeralda
            title_text = title or "BOA PRÁTICA COMPROVADA"
            t_color = "0.02 0.48 0.32"
        else: # info
            bg_rg = "0.93 0.95 1.0"       # azul suave KEDS
            border_rg = "0.0 0.34 0.85"   # azul KEDS #0057D9
            title_text = title or "DICA PRÁTICA KEDS"
            t_color = "0.0 0.34 0.85"

        cmd_box = f"""
        {bg_rg} rg
        50 {box_y} 495 {box_height} re
        f
        {border_rg} RG
        3 w
        50 {box_y} m
        50 {box_y + box_height} l
        S
        """
        self.current_page_commands.append(cmd_box)

        text_y = self.y
        if title_text:
            t_clean = self._clean(title_text)
            cmd_title = f"""
            BT
            /F1 8.5 Tf
            {t_color} rg
            64 {text_y} Td
            ({t_clean}) Tj
            ET
            """
            self.current_page_commands.append(cmd_title)
            text_y -= 15

        for line in lines:
            clean = self._clean(line)
            cmd_text = f"""
            BT
            /F2 9.5 Tf
            0.20 0.20 0.22 rg
            64 {text_y} Td
            ({clean}) Tj
            ET
            """
            self.current_page_commands.append(cmd_text)
            text_y -= 14.5

        self.y = box_y - 10

    def add_before_after(self, before_text, after_text, label_before="ANTES (Comum / Fraco)", label_after="DEPOIS (Alto Impacto KEDS)"):
        """Caixa de contraste Antes & Depois para ensinar redação orientada a resultados."""
        b_lines = textwrap.wrap(str(before_text), width=74)
        a_lines = textwrap.wrap(str(after_text), width=74)

        box_h = (len(b_lines) + len(a_lines)) * 14 + 54
        self._ensure_space(box_h + 16)
        box_y = self.y - box_h + 12

        # Fundo geral
        cmd = f"""
        0.97 0.97 0.98 rg
        50 {box_y} 495 {box_h} re
        f
        0.88 0.88 0.90 RG
        1 w
        50 {box_y} 495 {box_h} re
        S
        """
        self.current_page_commands.append(cmd)

        curr_y = self.y
        # Bloco ANTES
        lb_clean = self._clean(f"❌ {label_before}")
        cmd_lb = f"""
        BT
        /F1 9 Tf
        0.80 0.20 0.20 rg
        64 {curr_y} Td
        ({lb_clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd_lb)
        curr_y -= 15

        for line in b_lines:
            c = self._clean(line)
            cmd_b = f"""
            BT
            /F2 9 Tf
            0.45 0.45 0.50 rg
            64 {curr_y} Td
            ({c}) Tj
            ET
            """
            self.current_page_commands.append(cmd_b)
            curr_y -= 14

        curr_y -= 8
        # Linha divisória
        cmd_div = f"""
        0.88 0.88 0.90 RG
        0.5 w
        64 {curr_y + 4} m
        530 {curr_y + 4} l
        S
        """
        self.current_page_commands.append(cmd_div)

        # Bloco DEPOIS
        la_clean = self._clean(f"✅ {label_after}")
        cmd_la = f"""
        BT
        /F1 9 Tf
        0.0 0.50 0.25 rg
        64 {curr_y - 2} Td
        ({la_clean}) Tj
        ET
        """
        self.current_page_commands.append(cmd_la)
        curr_y -= 17

        for line in a_lines:
            c = self._clean(line)
            cmd_a = f"""
            BT
            /F1 9 Tf
            0.11 0.11 0.12 rg
            64 {curr_y} Td
            ({c}) Tj
            ET
            """
            self.current_page_commands.append(cmd_a)
            curr_y -= 14

        self.y = box_y - 12

    def add_recruiting_funnel_diagram(self):
        """Desenha o diagrama vetorial do Funil de Recrutamento em Portugal."""
        self._ensure_space(180)
        top_y = self.y
        box_y = top_y - 170

        title_c = self._clean("O FUNIL REAL DE RECRUTAMENTO EM PORTUGAL")
        cmd = f"""
        % Fundo do container
        0.97 0.97 0.98 rg
        50 {box_y} 495 170 re
        f
        0.88 0.88 0.90 RG
        1 w
        50 {box_y} 495 170 re
        S
        BT
        /F1 10 Tf
        0.11 0.11 0.12 rg
        65 {top_y - 18} Td
        ({title_c}) Tj
        ET

        % Nível 1: Triagem Automática e Filtros ATS
        0.93 0.95 1.0 rg
        65 {top_y - 60} 465 32 re
        f
        0.0 0.34 0.85 RG
        1.5 w
        65 {top_y - 60} 465 32 re
        S
        BT
        /F1 9.5 Tf
        0.0 0.34 0.85 rg
        75 {top_y - 48} Td
        (FASE 1: TRIAGEM ATS & FILTROS INICIAIS (Descarta at\351 75% dos ficheiros)) Tj
        /F2 8.5 Tf
        0.25 0.25 0.30 rg
        75 {top_y - 57} Td
        (L\352 t\355tulos, palavras-chave exatas, legibilidade cronol\363gica e formato de contactos.) Tj
        ET

        % Nível 2: Leitura Humana de 30 Segundos
        0.96 0.96 0.97 rg
        95 {top_y - 105} 405 32 re
        f
        0.60 0.60 0.65 RG
        1 w
        95 {top_y - 105} 405 32 re
        S
        BT
        /F1 9.5 Tf
        0.15 0.15 0.18 rg
        105 {top_y - 93} Td
        (FASE 2: LEITURA HUMANA R\301PIDA (Recrutador gasta 30 a 45 segundos)) Tj
        /F2 8.5 Tf
        0.32 0.32 0.35 rg
        105 {top_y - 102} Td
        (Busca evid\352ncias imediatas: organiza\347\343o, verbos de a\347\343o e contexto de trabalho em Portugal.) Tj
        ET

        % Nível 3: Entrevista e Proposta
        0.90 0.97 0.92 rg
        135 {top_y - 150} 325 32 re
        f
        0.02 0.59 0.41 RG
        1.5 w
        135 {top_y - 150} 325 32 re
        S
        BT
        /F1 9.5 Tf
        0.02 0.48 0.32 rg
        145 {top_y - 138} Td
        (FASE 3: ENTREVISTA STAR & PROPOSTA (Top 3 a 5 candidatos)) Tj
        /F2 8.5 Tf
        0.20 0.35 0.25 rg
        145 {top_y - 147} Td
        (Valida\347\343o de compet\352ncias comportamentais, exemplos pr\341ticos e alinhamento salarial.) Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y = box_y - 15

    def add_star_matrix_diagram(self):
        """Desenha a matriz vetorial 2x2 do Método STAR (Situação, Tarefa, Ação, Resultado)."""
        self._ensure_space(185)
        top_y = self.y
        box_y = top_y - 175

        cmd = f"""
        % Fundo do container
        0.97 0.97 0.98 rg
        50 {box_y} 495 175 re
        f
        0.88 0.88 0.90 RG
        1 w
        50 {box_y} 495 175 re
        S
        BT
        /F1 10.5 Tf
        0.11 0.11 0.12 rg
        65 {top_y - 18} Td
        (A MATRIZ STAR: COMO ESTRUTURAR RESPOSTAS DE ALTO IMPACTO) Tj
        ET

        % Quadrante S (Situação)
        0.94 0.96 1.0 rg
        65 {top_y - 85} 225 60 re
        f
        0.0 0.34 0.85 RG
        1 w
        65 {top_y - 85} 225 60 re
        S
        BT
        /F1 9.5 Tf
        0.0 0.34 0.85 rg
        75 {top_y - 40} Td
        ([S] SITUA\307\303O: O Contexto) Tj
        /F2 8 Tf
        0.20 0.20 0.25 rg
        75 {top_y - 54} Td
        (Qual era o desafio, empresa ou projeto?) Tj
        75 {top_y - 66} Td
        (Ex: \"Na empresa X t\355nhamos um atraso de 15 dias...\") Tj
        ET

        % Quadrante T (Tarefa)
        0.96 0.96 0.97 rg
        305 {top_y - 85} 225 60 re
        f
        0.60 0.60 0.65 RG
        1 w
        305 {top_y - 85} 225 60 re
        S
        BT
        /F1 9.5 Tf
        0.20 0.20 0.25 rg
        315 {top_y - 40} Td
        ([T] TAREFA: A Tua Miss\343o) Tj
        /F2 8 Tf
        0.30 0.30 0.35 rg
        315 {top_y - 54} Td
        (Qual era a tua responsabilidade direta?) Tj
        315 {top_y - 66} Td
        (Ex: \"Fui respons\341vel por desenhar novo fluxo...\") Tj
        ET

        % Quadrante A (Ação)
        0.96 0.96 0.97 rg
        65 {top_y - 155} 225 60 re
        f
        0.60 0.60 0.65 RG
        1 w
        65 {top_y - 155} 225 60 re
        S
        BT
        /F1 9.5 Tf
        0.20 0.20 0.25 rg
        75 {top_y - 110} Td
        ([A] A\307\303O: A Iniciativa (70% do tempo)) Tj
        /F2 8 Tf
        0.30 0.30 0.35 rg
        75 {top_y - 124} Td
        (O que fizeste concretamente? Ferramentas e m\351todo.) Tj
        75 {top_y - 136} Td
        (Ex: \"Convoquei a equipa, criei folha de controlo...\") Tj
        ET

        % Quadrante R (Resultado)
        0.90 0.97 0.92 rg
        305 {top_y - 155} 225 60 re
        f
        0.02 0.59 0.41 RG
        1 w
        305 {top_y - 155} 225 60 re
        S
        BT
        /F1 9.5 Tf
        0.02 0.48 0.32 rg
        315 {top_y - 110} Td
        ([R] RESULTADO: O Impacto Verific\341vel) Tj
        /F2 8 Tf
        0.15 0.30 0.20 rg
        315 {top_y - 124} Td
        (Qual foi o desfecho real e a aprendizagem?) Tj
        315 {top_y - 136} Td
        (Ex: \"Reduzimos o tempo em 30% sem custos adicionais.\") Tj
        ET
        """
        self.current_page_commands.append(cmd)
        self.y = box_y - 15

    def add_table(self, headers, rows, col_widths=None):
        """Desenha uma tabela com cabeçalho colorido e linhas alternadas em #F5F5F7."""
        num_cols = len(headers)
        if not col_widths:
            w = 495 / num_cols
            col_widths = [w] * num_cols

        row_h = 22
        table_h = (len(rows) + 1) * row_h
        self._ensure_space(table_h + 15)

        table_top = self.y

        # Cabeçalho da tabela
        cmd_hdr = f"""
        0.0 0.34 0.85 rg
        50 {table_top - row_h} 495 {row_h} re
        f
        """
        self.current_page_commands.append(cmd_hdr)

        cx = 56
        for idx, h in enumerate(headers):
            h_c = self._clean(h)
            cmd_h_txt = f"""
            BT
            /F1 9 Tf
            1.0 1.0 1.0 rg
            {cx} {table_top - 15} Td
            ({h_c}) Tj
            ET
            """
            self.current_page_commands.append(cmd_h_txt)
            cx += col_widths[idx]

        curr_y = table_top - row_h
        for r_idx, row in enumerate(rows):
            bg = "0.96 0.96 0.97" if r_idx % 2 == 1 else "1.0 1.0 1.0"
            cmd_row = f"""
            {bg} rg
            50 {curr_y - row_h} 495 {row_h} re
            f
            0.88 0.88 0.90 RG
            0.5 w
            50 {curr_y - row_h} 495 {row_h} re
            S
            """
            self.current_page_commands.append(cmd_row)

            cx = 56
            for c_idx, cell in enumerate(row):
                cell_c = self._clean(str(cell))
                cmd_c_txt = f"""
                BT
                /F2 8.5 Tf
                0.15 0.15 0.18 rg
                {cx} {curr_y - 15} Td
                ({cell_c}) Tj
                ET
                """
                self.current_page_commands.append(cmd_c_txt)
                cx += col_widths[c_idx]

            curr_y -= row_h

        self.y = curr_y - 12

    def add_worksheet_box(self, title, prompt_text, num_lines=3):
        """Desenha uma caixa de exercício com linhas pontilhadas para anotações do candidato."""
        lines = textwrap.wrap(prompt_text, width=76)
        prompt_h = len(lines) * 14
        box_h = prompt_h + num_lines * 22 + 36
        self._ensure_space(box_h + 14)

        box_y = self.y - box_h + 12

        t_c = self._clean(title)
        cmd = f"""
        0.98 0.98 0.99 rg
        50 {box_y} 495 {box_h} re
        f
        0.80 0.80 0.85 RG
        0.8 w
        50 {box_y} 495 {box_h} re
        S
        BT
        /F1 9.5 Tf
        0.0 0.34 0.85 rg
        65 {self.y} Td
        (\332 EXERC\315CIO PR\301TICO: {t_c}) Tj
        ET
        """
        self.current_page_commands.append(cmd)

        curr_y = self.y - 16
        for line in lines:
            c = self._clean(line)
            cmd_p = f"""
            BT
            /F2 9 Tf
            0.30 0.30 0.35 rg
            65 {curr_y} Td
            ({c}) Tj
            ET
            """
            self.current_page_commands.append(cmd_p)
            curr_y -= 14

        # Linhas pontilhadas
        curr_y -= 4
        for _ in range(num_lines):
            cmd_dot = f"""
            0.75 0.75 0.80 RG
            0.6 w
            [2 3] 0 d
            65 {curr_y} m
            530 {curr_y} l
            S
            [] 0 d
            """
            self.current_page_commands.append(cmd_dot)
            curr_y -= 22

        self.y = box_y - 10

    def save(self, filepath):
        # Fechar última página com rodapé se não for capa
        if not (self.has_cover and self.page_num == 1 and len(self.pages) == 0):
            footer_cmd = f"""
            BT
            /F2 8.5 Tf
            0.32 0.32 0.35 rg
            50 36 Td
            (Kit Emprego dos Sonhos \226 Portugal \226 {self._clean(self.doc_title)}) Tj
            420 0 Td
            (P\341gina {self.page_num}) Tj
            ET
            """
            self.current_page_commands.append(footer_cmd)

        self.pages.append("\n".join(self.current_page_commands))

        total_pages = len(self.pages)
        f1_obj = 3 + total_pages * 2
        f2_obj = f1_obj + 1
        f3_obj = f1_obj + 2
        f4_obj = f1_obj + 3

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
      /F3 {f3_obj} 0 R
      /F4 {f4_obj} 0 R
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
        objs[f1_obj] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
        objs[f2_obj] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
        objs[f3_obj] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>"
        objs[f4_obj] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-BoldOblique /Encoding /WinAnsiEncoding >>"

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
# GERADORES DE ENTREGÁVEIS DE ALTO IMPACTO
# ---------------------------------------------------------------------------

def generate_all_files():
    print("-> A gerar Modelos Word DOCX e Exemplos...")

    # 1. CV Essencial — Modelo
    d = DocxBuilder("CV Essencial — Modelo", is_cv=True)
    d.add_title("[O TEU NOME COMPLETO]")
    d.add_subtitle("[Cidade, Portugal] · [contacto@email.pt] · [+351 900 000 000] · [linkedin.com/in/perfil]")
    d.add_callout("INSTRUÇÕES DE PREENCHIMENTO: Este modelo foi concebido para edição no Microsoft Word, Google Docs ou LibreOffice. Segue uma estrutura linear de 1 coluna altamente compatível com filtros ATS e preferida por recrutadores em Portugal. Substitui os campos entre parênteses retos com dados verdadeiros.", variant="info")
    d.add_heading_1("Perfil Profissional")
    d.add_paragraph("[Resumo executivo de 2 a 3 linhas: especifica a tua área de atuação principal, anos de experiência ou foco técnico, e qual o valor tangível que acrescentas à organização em Portugal.]")
    d.add_heading_1("Experiência Profissional")
    d.add_heading_2("[Cargo / Função Desempenhada] — [Nome da Empresa]")
    d.add_paragraph("[Mês/Ano Início] – [Mês/Ano Fim ou Presente] | [Cidade, Portugal]", italic=True, color="51515A")
    d.add_bullet("[Verbo de ação + Tarefa concreta + Métrica ou resultado alcançado. Ex.: Otimizei o fluxo de triagem de pedidos, reduzindo o tempo de espera dos clientes em 20%.]")
    d.add_bullet("[Responsabilidade operacional chave, coordenação de tarefas ou melhoria de processos implementada.]")
    d.add_bullet("[Ferramentas, sistemas ou plataformas utilizadas diariamente (ex.: Excel, SAP, CRM, Microsoft 365).]")
    d.add_heading_2("[Cargo Anterior] — [Nome da Empresa Anterior]")
    d.add_paragraph("[Mês/Ano Início] – [Mês/Ano Fim] | [Cidade, Portugal]", italic=True, color="51515A")
    d.add_bullet("[Iniciativa de suporte a clientes ou apoio a equipas multidisciplinares.]")
    d.add_bullet("[Gestão documental, arquivo, conformidade legal ou faturação assegurada sem erros.]")
    d.add_heading_1("Formação e Qualificações")
    d.add_heading_2("[Designação do Curso, Licenciatura ou Certificação] — [Instituição de Ensino]")
    d.add_paragraph("[Ano de Conclusão] | [Destaque de módulos práticos ou competências principais adquiridas]", italic=True, color="51515A")
    d.add_heading_1("Competências Técnicas & Idiomas")
    d.add_bullet("Software & Ferramentas: [Microsoft Office avançado (Excel, Word), Google Workspace, ERP, CRM, Slack/Teams]")
    d.add_bullet("Competências Analíticas & Operacionais: [Gestão de Prazos, Atendimento ao Cliente, Conciliação, Resolução de Problemas]")
    d.add_bullet("Idiomas: Português (Nativo/C2), Inglês ([Nível real: B2 Profissional / C1 Fluente]), [Outro idioma]")
    d.save(PRIVATE_FILES_DIR / "cv-essencial-modelo.docx")

    # Exemplo fictício Essencial
    d_fict = DocxBuilder("CV Essencial — Exemplo Prático", is_cv=True)
    d_fict.add_title("Inês Matos Ferreira")
    d_fict.add_subtitle("Lisboa, Portugal · ines.ferreira@email.pt · +351 912 345 678 · linkedin.com/in/ines-ferreira-exemplo")
    d_fict.add_callout("EXEMPLO PRÁTICO DE APOIO: Perfil ilustrativo com dados realistas do mercado português de serviços e apoio à gestão. Observa o foco em dados concretos e verbos de ação.", variant="info")
    d_fict.add_heading_1("Perfil Profissional")
    d_fict.add_paragraph("Assistente de Operações e Apoio à Gestão com 4 anos de experiência em PMEs em Portugal. Foco na organização de processos de faturação, apoio ao cliente multicanal e gestão de pendências operacionais com rigor e autonomia.")
    d_fict.add_heading_1("Experiência Profissional")
    d_fict.add_heading_2("Assistente Operacional e de Atendimento — Soluções Integradas Lda.")
    d_fict.add_paragraph("Jan 2023 – Presente | Lisboa, Portugal", italic=True, color="51515A")
    d_fict.add_bullet("Assegurei o atendimento e resolução de 40+ pedidos diários de clientes, alcançando 94% de resolução no primeiro contacto.")
    d_fict.add_bullet("Estruturei o arquivo digital e a conferência de 150+ faturas mensais, eliminando discrepâncias com a contabilidade externa.")
    d_fict.add_bullet("Formei 2 novos colaboradores no uso do software de CRM e nos procedimentos padrão de resposta por email.")
    d_fict.add_heading_2("Assistente Administrativa Júnior — Logística e Distribuição SA")
    d_fict.add_paragraph("Set 2021 – Dez 2022 | Oeiras, Portugal", italic=True, color="51515A")
    d_fict.add_bullet("Fiz a gestão da correspondência, marcação de transportes e acompanhamento do estado de 30 entregas diárias.")
    d_fict.add_bullet("Elaborei folhas de cálculo de controlo diário de rotas em Excel, reduzindo perdas de informação entre armazém e escritório.")
    d_fict.add_heading_1("Formação Académica")
    d_fict.add_heading_2("Curso Técnico Superior Profissional em Assessoria de Gestão — Instituto Politécnico de Lisboa")
    d_fict.add_paragraph("Concluído em 2021 | Estágio curricular com avaliação final de 17 valores", italic=True, color="51515A")
    d_fict.add_heading_1("Competências & Ferramentas")
    d_fict.add_bullet("Ferramentas: Microsoft Excel (VLOOKUP, Tabelas Dinâmicas), Primavera ERP (Básico), Outlook, Teams, Trello")
    d_fict.add_bullet("Idiomas: Português (Língua Materna), Inglês (B2 — Utilizador Independente / Boa comunicação escrita)")
    d_fict.save(PRIVATE_FILES_DIR / "cv-essencial-exemplo-ficticio.docx")

    # Referência Visual Essencial (PDF)
    p_ref = PdfBuilder("CV Essencial — Referência Visual A4")
    p_ref.add_cover_page(
        "CV Essencial — Estrutura e Referência Visual A4",
        "Manual de Diagramação, Hierarquia Cronológica e Otimização para Filtros ATS",
        badge="MODELO OFICIAL KEDS · 1 COLUNA ATS",
        meta_items=[
            ("Formato Recomendado", "Microsoft Word (.docx) ou PDF A4"),
            ("Compatibilidade ATS", "100% — Sem caixas de texto flutuantes"),
            ("Leitura Humana", "Avaliação cronológica em 30 segundos"),
            ("Indústria Recomendada", "Serviços, Operações, Banca, PMEs e Setor Público")
        ]
    )
    p_ref.add_title("Anatomia de um Currículo de Alto Impacto")
    p_ref.add_subtitle("Porque é que a estrutura linear em 1 coluna lidera as contratações em Portugal")
    p_ref.add_callout(
        "Os sistemas de triagem (ATS) como Workday, Taleo ou BambooHR leem currículos da esquerda para a direita e de cima para baixo. Layouts em múltiplas colunas ou gráficos em barra geram erros graves de importação. O modelo Essencial garante legibilidade total.",
        title="REGRA DE OURO ATS",
        variant="info"
    )
    p_ref.add_heading("1. Os 5 Blocos Estruturais Obrigatórios", level=1)
    p_ref.add_bullet("Cabeçalho Direto: Nome completo em destaque, Cidade/Distrito (Portugal), Telefone direto (+351), Email profissional e URL limpo do LinkedIn.")
    p_ref.add_bullet("Perfil Profissional (3 linhas): Síntese de valor prática — quem és, a tua área e o teu diferencial concreto.")
    p_ref.add_bullet("Experiência Profissional Reversa: Cada cargo com Função, Empresa, Datas e 2 a 4 pontos orientados a ação e métricas.")
    p_ref.add_bullet("Formação e Certificações: Cursos oficiais com instituição e ano.")
    p_ref.add_bullet("Competências e Ferramentas: Sem barras percentuais inventadas (ninguém tem '85% de Excel'). Indica ferramentas reais e nível de proficiência.")

    p_ref.add_heading("2. Contraste de Formulação de Tarefas", level=1)
    p_ref.add_before_after(
        "Responsável por atender o telefone e falar com clientes sobre encomendas.",
        "Assegurei o atendimento e resolução de 40+ pedidos diários de clientes, mantendo uma taxa de 94% de resolução no primeiro contacto.",
        label_before="Fraco / Passivo (Apenas lista tarefas)",
        label_after="Alto Impacto KEDS (Métrica + Ação + Contexto)"
    )
    p_ref.add_callout(
        "Em Portugal, a fotografia NÃO é obrigatória por lei. No modelo Essencial, focar exclusivamente no mérito e no percurso profissional aumenta a taxa de passagem na primeira triagem.",
        title="FOTOGRAFIA NO CV",
        variant="warning"
    )
    p_ref.save(PRIVATE_FILES_DIR / "cv-essencial-referencia.pdf")
    shutil.copy2(PRIVATE_FILES_DIR / "cv-essencial-referencia.pdf", PUBLIC_DOWNLOADS_DIR / "cv-essencial-referencia.pdf")

    # 2. CV Moderno (DOCX sem marca)
    d_mod = DocxBuilder("CV Moderno — Modelo", is_cv=True)
    d_mod.add_title("[O TEU NOME COMPLETO]")
    d_mod.add_subtitle("[Área de Especialização / Cargo Alvo] · [Cidade, Portugal] · [email@dominio.pt] · [+351 900 000 000]")
    d_mod.add_callout("MODELO MODERNO: Estrutura contemporânea equilibrada, ideal para áreas de tecnologia, marketing, gestão de projetos e ambientes de inovação. Espaço flexível para competências digitais e certificações.", variant="info")
    d_mod.add_heading_1("Resumo Executivo & Competências Chave")
    d_mod.add_paragraph("[Apresentação concisa com foco no impacto que geras. Destaca metodologias de trabalho (ex.: Agile, Scrum, Lean) e os resultados recentes obtidos em projetos anteriores.]")
    d_mod.add_heading_1("Experiência e Realizações")
    d_mod.add_heading_2("[Função Recente] — [Empresa / Organização]")
    d_mod.add_paragraph("[Período Início – Fim] | [Modelo de Trabalho: Presencial / Híbrido / Remoto] | [Cidade, Portugal]", italic=True, color="51515A")
    d_mod.add_bullet("[Iniciativa de liderança, desenvolvimento ou melhoria contínua de processos.]")
    d_mod.add_bullet("[Métricas quantificáveis: % de crescimento, poupança de tempo, redução de custos ou volume de utilizadores.]")
    d_mod.add_bullet("[Ecossistema tecnológico e ferramentas chave utilizadas.]")
    d_mod.add_heading_1("Educação & Especializações")
    d_mod.add_heading_2("[Grau Académico ou Curso de Especialização] — [Universidade ou Instituto]")
    d_mod.add_paragraph("[Ano de Conclusão] | [Projetos relevantes desenvolvidos]", italic=True, color="51515A")
    d_mod.add_heading_1("Stack de Competências Digitais")
    d_mod.add_bullet("Gestão e Produtividade: [Jira, Asana, Notion, Confluence, Miro, Slack]")
    d_mod.add_bullet("Ferramentas de Análise e Criação: [Power BI, Google Analytics, Figma, SQL, Excel Avançado]")
    d_mod.add_bullet("Idiomas de Trabalho: [Português (C2), Inglês (Fluente de Negócios C1/C2)]")
    d_mod.save(PRIVATE_FILES_DIR / "cv-moderno-modelo.docx")

    # Exemplo fictício Moderno
    d_mod_fict = DocxBuilder("CV Moderno — Exemplo", is_cv=True)
    d_mod_fict.add_title("Tiago Lourenço Rocha")
    d_mod_fict.add_subtitle("Gestor de Projetos Digitais | Porto, Portugal · tiago.rocha@email.pt · +351 920 111 222 · linkedin.com/in/tiago-rocha-digital")
    d_mod_fict.add_callout("Exemplo ilustrativo de preenchimento do modelo Moderno para perfil tecnológico e de gestão de produto.", variant="info")
    d_mod_fict.add_heading_1("Resumo Executivo")
    d_mod_fict.add_paragraph("Gestor de Projetos com 5 anos de experiência na implementação de soluções de comércio eletrónico e automatização de fluxos de trabalho no mercado ibérico. Especialista em metodologias ágeis (Scrum/Kanban) e gestão de equipas multidisciplinares.")
    d_mod_fict.add_heading_1("Experiência Profissional")
    d_mod_fict.add_heading_2("Project Manager & Scrum Master — TechVentures Ibéria")
    d_mod_fict.add_paragraph("Fev 2022 – Presente | Porto, Portugal (Regime Híbrido)", italic=True, color="51515A")
    d_mod_fict.add_bullet("Liderei 4 sprints de lançamento de uma nova plataforma B2B, entregando a versão MVP 3 semanas antes do prazo limite.")
    d_mod_fict.add_bullet("Implementei cerimónias Scrum e fluxos no Jira que reduziram o 'lead time' de desenvolvimento de funcionalidades em 28%.")
    d_mod_fict.add_bullet("Fiz a gestão do orçamento do projeto (120.000 EUR) e coordenação direta de 8 engenheiros e designers.")
    d_mod_fict.add_heading_1("Formação Académica")
    d_mod_fict.add_heading_2("Mestrado Integrado em Engenharia e Gestão Industrial — Faculdade de Engenharia da Univ. do Porto")
    d_mod_fict.add_paragraph("2016 – 2021 | Dissertação sobre Otimização de Processos Digitais", italic=True, color="51515A")
    d_mod_fict.add_heading_1("Stack Técnico")
    d_mod_fict.add_bullet("Metodologias: Scrum, Kanban, Agile Project Management (Certificação PSM I)")
    d_mod_fict.add_bullet("Software: Jira, Confluence, Trello, Figma, Power BI, SQL básico")
    d_mod_fict.add_bullet("Idiomas: Português (Nativo), Inglês (Fluente C1), Espanhol (B2)")
    d_mod_fict.save(PRIVATE_FILES_DIR / "cv-moderno-exemplo-ficticio.docx")

    # Referência Visual Moderno (PDF)
    p_mod_ref = PdfBuilder("CV Moderno — Referência Visual A4")
    p_mod_ref.add_cover_page(
        "CV Moderno — Estrutura e Referência Visual A4",
        "Guia para Funções Dinâmicas, Ambientes Tecnológicos e Setores Inovadores em Portugal",
        badge="MODELO OFICIAL KEDS · CONTEMPORÂNEO",
        meta_items=[
            ("Design", "Moderno Executivo com Destaque Tipográfico"),
            ("Público-Alvo", "Tecnologia, Marketing, Gestão de Projetos e Criativos"),
            ("Hierarquia", "Bloco Superior de Especialidade + Stack Técnico"),
            ("Formato", "Word A4 (.docx) e Exportação em PDF")
        ]
    )
    p_mod_ref.add_title("Diferenciais Estruturais do CV Moderno")
    p_mod_ref.add_subtitle("Como destacar competências digitais sem comprometer a sobriedade")
    p_mod_ref.add_callout(
        "O modelo Moderno privilegia a clareza sobre o impacto. É ideal para profissionais com competências transversais em ferramentas digitais e que pretendem candidatar-se a startups, scaleups ou multinacionais com sede em Lisboa, Porto ou Braga.",
        title="POSICIONAMENTO DE MERCADO",
        variant="info"
    )
    p_mod_ref.add_heading("Estrutura Recomendada Passo a Passo", level=1)
    p_mod_ref.add_bullet("1. Cargo Alvo no Cabeçalho: Imediatamente abaixo do nome, define a tua identidade profissional em 3 a 5 palavras.")
    p_mod_ref.add_bullet("2. Resumo de Proposta de Valor: O que a tua contratação vai poupar ou gerar de valor para a equipa.")
    p_mod_ref.add_bullet("3. Experiência Focada em Projetos: Menciona o regime (Presencial, Híbrido ou Remoto), ferramenta utilizada e resultado.")
    p_mod_ref.add_bullet("4. Bloco de Ferramentas Técnicas: Agrupa por categorias (Gestão, Análise, Design, Idiomas).")
    p_mod_ref.save(PRIVATE_FILES_DIR / "cv-moderno-referencia.pdf")

    # 3. Cartas de Apresentação (DOCX e PDF)
    print("-> A gerar Cartas de Apresentação...")
    cartas_text = (ROOT / "content" / "kit" / "cartas.md").read_text(encoding="utf-8")
    sections = cartas_text.split("## ")

    d_cartas = DocxBuilder("Cartas de Apresentação KEDS")
    d_cartas.add_title("Pack de 3 Cartas de Apresentação Estratégicas")
    d_cartas.add_subtitle("Modelos Adaptáveis para o Mercado de Trabalho em Portugal")
    d_cartas.add_callout("INSTRUÇÕES: A carta de apresentação não deve repetir o teu CV. A sua função é contextualizar a tua motivação específica para a vaga e demonstrar que conheces a empresa. Adapta sempre os campos [entre parênteses retos].", variant="info")
    for sec in sections[1:]:
        lines = sec.strip().split("\n")
        title = lines[0]
        d_cartas.add_heading_1(title)
        for line in lines[1:]:
            l = line.strip()
            if not l: continue
            if l.startswith("**") and l.endswith("**"): d_cartas.add_paragraph(l.replace("**", ""), bold=True)
            elif l.startswith("-") or l.startswith("•"): d_cartas.add_bullet(l.lstrip("-• "))
            elif l.startswith("> "): d_cartas.add_callout(l[2:], variant="info")
            else: d_cartas.add_paragraph(l)
    d_cartas.save(PRIVATE_FILES_DIR / "cartas-de-apresentacao-keds.docx")

    p_cartas = PdfBuilder("Cartas de Apresentação KEDS")
    p_cartas.add_cover_page(
        "Cartas de Apresentação Estratégicas",
        "3 Estruturas de Alta Persuasão para Candidaturas Diretas, Transição de Carreira e Abordagem Espontânea",
        badge="KIT EMPREGO DOS SONHOS · CARTAS",
        meta_items=[
            ("Número de Modelos", "3 Cartas Completas"),
            ("Estrutura", "Gancho Inicial + Prova de Valor + Apelo à Ação"),
            ("Linguagem", "Português de Portugal Formal e Contemporâneo"),
            ("Finalidade", "Acompanhamento de CV em Email ou Plataforma")
        ]
    )
    p_cartas.add_title("Como Escrever uma Carta que os Recrutadores Realmente Leem")
    p_cartas.add_subtitle("Regras fundamentais de etiqueta profissional em Portugal")
    p_cartas.add_callout(
        "Uma carta eficaz tem entre 3 e 4 parágrafos curtos. Nunca comeces com 'Venho por este meio candidatar-me à vossa conceituada empresa...'. Vai direto ao motivo pelo qual o teu percurso resolve o desafio concreto daquela vaga.",
        title="DICA DE PERSUASÃO",
        variant="info"
    )
    for sec in sections[1:]:
        lines = sec.strip().split("\n")
        p_cartas.add_heading(lines[0], level=1)
        for line in lines[1:]:
            l = line.strip()
            if not l: continue
            if l.startswith("### "): p_cartas.add_heading(l.replace("### ", ""), level=2)
            elif l.startswith("**"): p_cartas.add_paragraph(l.replace("**", ""), bold=True)
            elif l.startswith("- ") or l.startswith("• "): p_cartas.add_bullet(l.lstrip("-• "))
            elif l.startswith("> "): p_cartas.add_callout(l[2:], variant="info")
            else:
                clean_l = re.sub(r'\*\*(.*?)\*\*', r'\1', l)
                p_cartas.add_paragraph(clean_l)
    p_cartas.save(PRIVATE_FILES_DIR / "cartas-de-apresentacao-keds.pdf")

    # 4. Guia Principal KEDS (10 Lições com Capa Editorial e Diagramas)
    print("-> A gerar Guia Oficial KEDS Portugal (10 Lições com Capa e Diagramas)...")
    p_guia = PdfBuilder("Guia Oficial KEDS Portugal")
    p_guia.add_cover_page(
        "Guia Oficial KEDS: O Teu Próximo Emprego em Portugal",
        "Manual Prático Passo a Passo: Canais de Recrutamento, Otimização de CV, Redes Profissionais e Negociação Salarial",
        badge="EDIFICADO SEGUNDO DIRETRIZES KEDS v3/v5",
        meta_items=[
            ("Conteúdo", "10 Lições Estratégicas Completas"),
            ("Mercado", "Portugal (Legislação Laboral, 14 Meses e Regime Geral)"),
            ("Foco", "Execução Prática, Sem Métricas Falsas ou Fórmulas Mágicas"),
            ("Entrega", "Ficheiro PDF de Consulta Permanente")
        ]
    )
    p_guia.add_title("Introdução à Estratégia de Candidatura KEDS")
    p_guia.add_subtitle("Compreender a mecânica do mercado antes de disparar currículos")
    p_guia.add_callout(
        "Em Portugal, a maioria dos candidatos comete o erro de enviar 100 candidaturas idênticas e aguardar respostas. O método KEDS foca-se na qualidade do posicionamento: 15 candidaturas cirúrgicas e bem direcionadas geram 5x mais entrevistas do que envios massivos sem contexto.",
        title="PRINCÍPIO DA CANDIDATURA ESTRATÉGICA",
        variant="info"
    )

    # Inserir o Diagrama do Funil de Recrutamento logo no início
    p_guia.add_recruiting_funnel_diagram()

    licoes_meta = json.loads((ROOT / "content" / "kit" / "licoes.json").read_text(encoding="utf-8"))["lessons"]
    for item in licoes_meta:
        lesson_file = ROOT / item["source"]
        if not lesson_file.is_file(): continue
        lines = lesson_file.read_text(encoding="utf-8").strip().split("\n")
        p_guia.add_heading(f"Lição {item['order']}: {item['title']}", level=1)
        for line in lines:
            l = line.strip()
            if not l or l.startswith("# "): continue
            if l.startswith("## "): p_guia.add_heading(l.replace("## ", ""), level=2)
            elif l.startswith("### "): p_guia.add_heading(l.replace("### ", ""), level=3)
            elif l.startswith("- ") or l.startswith("* "): p_guia.add_bullet(l[2:])
            elif l.startswith("> "): p_guia.add_callout(l[2:], variant="info")
            else:
                clean_l = re.sub(r'\*\*(.*?)\*\*', r'\1', l)
                clean_l = re.sub(r'\*(.*?)\*', r'\1', clean_l)
                p_guia.add_paragraph(clean_l)

        # Adicionar chamada de reforço em lições-chave
        if item["order"] == 2:
            p_guia.add_before_after(
                "Trabalhei como assistente e fazia relatórios mensais e gestão de stocks.",
                "Implementei sistema de inventário quinzenal no software Primavera, reduzindo quebras de stock em 15% ao fim de 6 meses.",
                label_before="Descrição Passiva",
                label_after="Descrição de Alto Impacto"
            )

    p_guia.save(PRIVATE_FILES_DIR / "guia-keds-portugal.pdf")

    # Amostra gratuita da Lição 1 em public/downloads/
    p_amostra = PdfBuilder("Amostra Gratuita — Guia KEDS", is_sample=True)
    p_amostra.add_cover_page(
        "Guia KEDS Portugal — Amostra Gratuita",
        "Lição 1: O Mercado de Trabalho em Portugal e os Canais de Recrutamento que Funcionam",
        badge="AMOSTRA GRATUITA KEDS",
        meta_items=[
            ("Conteúdo", "Lição 1 Completa + Diagrama do Funil"),
            ("Acesso Completo", "Disponível no Kit Emprego dos Sonhos Oficial"),
            ("Preço do Kit", "14,90 € (Acesso Imediato sem Subscrição)")
        ]
    )
    p_amostra.add_recruiting_funnel_diagram()
    l1_file = ROOT / "content" / "kit" / "licao-01.md"
    if l1_file.is_file():
        for line in l1_file.read_text(encoding="utf-8").strip().split("\n"):
            l = line.strip()
            if not l or l.startswith("# "): continue
            if l.startswith("## "): p_amostra.add_heading(l.replace("## ", ""), level=2)
            elif l.startswith("- "): p_amostra.add_bullet(l[2:])
            elif l.startswith("> "): p_amostra.add_callout(l[2:], variant="info")
            else:
                clean_l = re.sub(r'\*\*(.*?)\*\*', r'\1', l)
                p_amostra.add_paragraph(clean_l)
    p_amostra.save(PUBLIC_DOWNLOADS_DIR / "amostra-guia-keds.pdf")

    # 5. Mensagens de Candidatura (PDF)
    print("-> A gerar 10 Mensagens de Candidatura...")
    p_msg = PdfBuilder("10 Mensagens de Candidatura")
    p_msg.add_cover_page(
        "10 Mensagens Prontas de Abordagem e Candidatura",
        "Modelos Testados para LinkedIn, Email Direto, Acompanhamento Pós-Entrevista e Reativação de Contactos",
        badge="KIT KEDS · COMUNICAÇÃO PROFISSIONAL",
        meta_items=[
            ("Formatos", "Notas de Ligação LinkedIn e Emails Estruturados"),
            ("Cenários", "Recrutadores, Chefias Diretas e Follow-Up"),
            ("Tom de Voz", "Profissional, Conciso e Respeitoso em PT-PT")
        ]
    )
    p_msg.add_title("Guião de Utilização das Mensagens")
    p_msg.add_subtitle("Como personalizar cada mensagem para garantir resposta em Portugal")
    p_msg.add_callout(
        "Nunca envies uma mensagem sem preencher os campos de contexto. Menciona sempre um detalhe verídico sobre a empresa ou sobre a pessoa com quem estás a falar para demonstrar que a abordagem é personalizada.",
        title="AVISO DE ETIQUETA",
        variant="warning"
    )
    mensagens_data = json.loads((ROOT / "content" / "kit" / "mensagens.json").read_text(encoding="utf-8"))["messages"]
    for msg in mensagens_data:
        p_msg.add_heading(f"{msg['id'].upper()} — {msg['title']}", level=1)
        p_msg.add_callout(f"Assunto sugerido: {msg['subject']}", title="LINHA DE ASSUNTO RECOMENDADA", variant="info")
        for line in msg["body"].split("\n"):
            if line.strip(): p_msg.add_paragraph(line.strip())
        p_msg.add_worksheet_box(f"Personalização da {msg['title']}", "Escreve aqui o gancho de contexto que vais usar para a empresa específica:", num_lines=2)
    p_msg.save(PRIVATE_FILES_DIR / "mensagens-de-candidatura-keds.pdf")

    # 6. Checklists de Preparação (PDF)
    print("-> A gerar Checklists de Preparação...")
    p_chk = PdfBuilder("Checklists de Preparação")
    p_chk.add_cover_page(
        "Checklists Operacionais de Candidatura",
        "Roteiro de Validação Pré-Envio: Formatação de CV, Revisão de Carta, Perfil LinkedIn e Preparação para Entrevista",
        badge="KIT KEDS · CONTROLO DE QUALIDADE",
        meta_items=[
            ("Finalidade", "Prevenção de Erros Graves que Descartam Candidaturas"),
            ("Pontos de Verificação", "Mais de 30 itens auditados passo a passo")
        ]
    )
    p_chk.add_title("Listas de Verificação Passo a Passo")
    p_chk.add_subtitle("Garante que nenhum detalhe elimina a tua candidatura antes da leitura humana")
    checklists_data = json.loads((ROOT / "content" / "kit" / "checklists.json").read_text(encoding="utf-8"))["checklists"]
    for cl in checklists_data:
        p_chk.add_heading(f"Checklist: {cl['id'].upper()} — Auditoria Operacional", level=1)
        for item in cl["items"]:
            p_chk.add_bullet(f"[  ] {item}")
        p_chk.add_worksheet_box(f"Notas de Revisão da {cl['id'].upper()}", "Regista aqui os ajustes que ainda precisas de fazer antes de submeter:", num_lines=2)
    p_chk.save(PRIVATE_FILES_DIR / "checklists-preparacao-keds.pdf")

    # 7. 25 Prompts de IA (PDF)
    print("-> A gerar 25 Prompts Estratégicos de IA...")
    p_prm = PdfBuilder("25 Instruções de IA")
    p_prm.add_cover_page(
        "25 Prompts Estratégicos de Inteligência Artificial",
        "Instruções Avançadas para ChatGPT, Claude e Gemini: Apoio na Redação, Simulação de Entrevistas e Análise de Requisitos",
        badge="KIT KEDS · FERRAMENTAS INTELIGENTES",
        meta_items=[
            ("Regra de Ouro", "A IA é copiloto de redação. Nunca inventes factos ou diplomas."),
            ("Compatibilidade", "Funciona com ChatGPT, Claude, Gemini e Copilot"),
            ("Foco", "Adaptação de experiências reais à linguagem de anúncios em Portugal")
        ]
    )
    p_prm.add_title("Manual de Engenharia de Prompts para Emprego")
    p_prm.add_subtitle("Como extrair respostas ricas e personalizadas sem soar genérico")
    p_prm.add_callout(
        "IMPORTANTE: Não forneças dados confidenciais de antigas empresas ou dados bancários/pessoais aos assistentes de IA. Substitui nomes por termos gerais (ex.: 'empresa de distribuição em Portugal').",
        title="PRIVACIDADE E SEGURANÇA",
        variant="warning"
    )
    prompts_data = json.loads((ROOT / "content" / "kit" / "prompts.json").read_text(encoding="utf-8"))["prompts"]
    for pr in prompts_data:
        p_prm.add_heading(f"Prompt {pr['id'].upper()}: Assistente de Redação", level=1)
        p_prm.add_callout(pr["text"], title="COPIA E COLA NO TEU CHAT DE IA", variant="info")
    p_prm.save(PRIVATE_FILES_DIR / "25-prompts-ia-keds.pdf")

    # 8. Plano de 7 Dias (PDF)
    print("-> A gerar Plano de Ação de 7 Dias...")
    p_pln = PdfBuilder("Plano de Ação de 7 Dias")
    p_pln.add_cover_page(
        "Plano de Ação Estratégico de 7 Dias",
        "Roteiro Diário de 45 a 60 Minutos para Estruturar, Testar e Lançar a Tua Procura Ativa de Emprego",
        badge="KIT KEDS · CRONOGRAMA PRÁTICO",
        meta_items=[
            ("Duração", "7 Dias Consecutivos (Sprint de Foco)"),
            ("Tempo Exigido", "45 a 60 minutos por dia"),
            ("Resultado", "Dossiê completo pronto a enviar no mercado português")
        ]
    )
    p_pln.add_title("O Teu Sprint de Candidatura em 7 Dias")
    p_pln.add_subtitle("Menos ansiedade, mais disciplina e resultados consistentes")
    plano_data = json.loads((ROOT / "content" / "kit" / "plano-7-dias.json").read_text(encoding="utf-8"))["days"]
    for d_item in plano_data:
        p_pln.add_heading(f"Dia {d_item['day']}: {d_item['title']}", level=1)
        p_pln.add_paragraph(d_item["task"])
        p_pln.add_callout(f"Lição do Guia recomendada para estudo hoje: {d_item['lessonSlug']}", title="MATERIAL DE APOIO", variant="info")
        p_pln.add_worksheet_box(f"Registo de Execução — Dia {d_item['day']}", "O que concluí hoje e qual o próximo passo de amanhã:", num_lines=2)
    p_pln.save(PRIVATE_FILES_DIR / "plano-7-dias-keds.pdf")

    # 9. Organizador de Candidaturas (CSV de 18 Colunas)
    print("-> A gerar Organizador de Candidaturas em CSV...")
    csv_header = (
        "ID,Empresa,Setor,Função,Localização,Regime (Presencial/Híbrido/Remoto),"
        "Canal de Candidatura,Data de Envio,Versão do CV Utilizada,Carta de Apresentação,"
        "Salário Indicado/Expectativa (Anual Bruto),Contacto do Recrutador,"
        "Estado Atual,Data da Entrevista,Próximo Passo Agendado,Follow-up Realizado,"
        "Data Limite Follow-up,Notas & Aprendizagens\n"
    )
    csv_sample_1 = (
        "001,Tech Solutions Portugal,Tecnologia & Serviços,Gestor de Operações Júnior,Lisboa,Híbrido,"
        "LinkedIn Jobs,2026-09-15,CV Moderno v2,Sim (Carta 1 Adaptada),24.000 EUR,Mariana Silva (HR),"
        "Entrevista RH Agendada,2026-09-22,Preparar respostas STAR sobre gestão de conflitos,Sim,2026-09-25,"
        "Empresa valoriza experiência em ferramentas de ticketing e boa comunicação oral em inglês.\n"
    )
    csv_sample_2 = (
        "002,Distribuição Ibérica Lda,Logística & Retalho,Assistente Administrativo de Apoio à Gestão,Porto,Presencial,"
        "Net-Empregos,2026-09-16,CV Essencial v1,Não solicitada,18.500 EUR + Subsídio Alimentação,Rui Santos,"
        "Submetida,Pendente,Confirmar receção por mensagem de follow-up,Não,2026-09-23,"
        "Anúncio pedia conhecimento sólido de Excel (VLOOKUP e Tabelas Dinâmicas).\n"
    )
    csv_sample_3 = (
        "003,Inovação Sustentável SA,Energia & Ambiente,Técnico Comercial B2B,Remoto (Portugal),Remoto,"
        "Candidatura Espontânea por Email,2026-09-17,CV Moderno v2,Sim (Carta 3 Espontânea),26.000 EUR + Variável,Diretor Comercial,"
        "Contacto Inicial Realizado,2026-09-26,Apresentar percurso e casos práticos de negociação,Sim,2026-09-30,"
        "Contacto direto feito via LinkedIn com o responsável da área.\n"
    )
    (PRIVATE_FILES_DIR / "organizador-candidaturas.csv").write_text(
        csv_header + csv_sample_1 + csv_sample_2 + csv_sample_3, encoding="utf-8"
    )
    print(f"  [CSV]  Gerado: organizador-candidaturas.csv (18 colunas com linhas de demonstração)")

    # 10. Bump Entrevista dos Sonhos (PDF Guia + Caderno de Exercícios)
    print("-> A gerar Bump Entrevista dos Sonhos (Guia + Caderno de Exercícios)...")
    p_ent = PdfBuilder("Entrevista dos Sonhos — Guia e Workbook")
    p_ent.add_cover_page(
        "Entrevista dos Sonhos: Guia de Alta Performance + Caderno de Exercícios",
        "Domina o Método STAR, Antecipa 16 Perguntas Difíceis de Recrutadores e Negocia Condições Salariais em Portugal com Confiança",
        badge="ACELERADOR EXECUTIVO · BUMP ENTREVISTA",
        meta_items=[
            ("Metodologia", "Estrutura STAR (Situação, Tarefa, Ação, Resultado)"),
            ("Banco Prático", "16 Perguntas Reais Analisadas e Respondidas"),
            ("Negociação Salarial", "Regime de 14 Meses, Subsídio de Alimentação e Benefícios"),
            ("Caderno Prático", "Fichas de Ensaio e Exercícios para Preenchimento")
        ]
    )

    # Adicionar a Matriz STAR Visual
    p_ent.add_star_matrix_diagram()

    p_ent.add_heading("1. A Psicologia do Recrutador em Portugal", level=1)
    p_ent.add_paragraph("Numa entrevista de emprego em Portugal, os recrutadores não estão à procura de respostas perfeitas ou discursos decorados. O objetivo central é verificar duas coisas essenciais: (1) Se os exemplos do teu currículo são verdadeiros e como agiste sob pressão; (2) Se a tua postura de trabalho e comunicação se enquadram na dinâmica da equipa.")
    p_ent.add_callout(
        "Regra Fundamental KEDS: Fala sempre na primeira pessoa do singular ('Eu fiz', 'Eu decidi', 'Eu contactei'). Quando dizes 'Nós fizemos', o recrutador fica sem saber qual foi o teu contributo individual específico.",
        title="DICA DE OURO DO ENTREVISTADOR",
        variant="info"
    )

    p_ent.add_heading("2. Guia de Negociação Salarial em Portugal (14 Meses e Benefícios)", level=1)
    p_ent.add_paragraph("Em Portugal, os salários são legalmente pagos em 14 meses (salário base mensal x 14, incluindo subsídio de férias e subsídio de Natal). Ao discutir condições:")
    p_ent.add_bullet("Fala sempre em Salário Bruto Anual: Evita ambiguidades perguntando 'O valor proposto é bruto anual a 14 meses?'.")
    p_ent.add_bullet("Subsídio de Alimentação: Em cartão de refeição é isento de IRS/SS até ao teto legal (atualmente 10,20 EUR/dia). Num mês completo representa mais de 220 EUR líquidos.")
    p_ent.add_bullet("Modelo de Trabalho: Se o cargo for híbrido, confirma se as despesas de deslocação ou subsídio de teletrabalho estão contemplados.")
    p_ent.add_callout(
        "Quando perguntarem: 'Qual a sua expectativa salarial?', responde: 'Tendo em conta as responsabilidades da função e a minha experiência comprovada, tenho como referência um intervalo entre [Valor X] e [Valor Y] brutos anuais, mas estou disponível para analisar o pacote global de benefícios e plano de evolução da empresa.'",
        title="COMO RESPONDER À EXPECTATIVA SALARIAL",
        variant="success"
    )

    # Tabela com as 16 Perguntas de Entrevista e Intenção do Recrutador
    p_ent.add_heading("3. Banco das 16 Perguntas Reais e Critérios de Avaliação", level=1)
    perguntas_tabela = [
        ("1. Fale-me sobre o seu percurso.", "Avalia capacidade de síntese e coerência."),
        ("2. Porque quer sair da empresa atual?", "Testa maturidade; nunca critiques chefias."),
        ("3. Conta uma situação de conflito com colega.", "Mede inteligência emocional e foco na solução."),
        ("4. Dá um exemplo de erro e como resolveste.", "Testa humildade e capacidade de aprendizagem."),
        ("5. Como geres prazos muito apertados?", "Avalia priorização e resistência ao stress."),
        ("6. Porque devemos escolher-te a ti?", "Testa autoconhecimento e proposta de valor."),
        ("7. Como lidas com clientes insatisfeitos?", "Avalia resiliência e comunicação assertiva."),
        ("8. O que fazes quando te falta informação?", "Mede autonomia e capacidade de pedir apoio.")
    ]
    p_ent.add_table(["Pergunta Típica do Recrutador", "O Que o Entrevistador Está Realmente a Avaliar"], perguntas_tabela)

    p_ent.add_heading("4. Caderno de Exercícios Práticos (Worksheet)", level=1)
    p_ent.add_worksheet_box("Ficha STAR 1 — Situação de Pressão ou Resolução de Problema", "Escreve aqui a Situação, a Tarefa, a tua Ação direta e o Resultado final:", num_lines=4)
    p_ent.add_worksheet_box("Ficha STAR 2 — Melhoria de Processo ou Trabalho em Equipa", "Descreve um momento em que ajudaste a equipa a alcançar um objetivo comum:", num_lines=4)
    p_ent.add_worksheet_box("As Tuas Perguntas Estratégicas para o Recrutador", "Escreve 3 perguntas inteligentes para fazeres no final da entrevista sobre a empresa:", num_lines=3)

    p_ent.save(PRIVATE_FILES_DIR / "entrevista-dos-sonhos-guia-workbook.pdf")

    # 11. Bump LinkedIn dos Sonhos (PDF Guia + Caderno de Exercícios)
    print("-> A gerar Bump LinkedIn dos Sonhos (Guia + Caderno de Exercícios)...")
    p_lnk = PdfBuilder("LinkedIn dos Sonhos — Guia e Workbook")
    p_lnk.add_cover_page(
        "LinkedIn dos Sonhos: Guia de Otimização de Perfil + Caderno de Exercícios",
        "Como Transformar o Teu Perfil num Íman de Oportunidades: Títulos ATS, Narrativa 'Sobre', Networking Cirúrgico e Rotina Semanal",
        badge="ACELERADOR EXECUTIVO · BUMP LINKEDIN",
        meta_items=[
            ("Posicionamento", "Algoritmo de Pesquisa do LinkedIn Recruiter"),
            ("Fórmulas de Título", "4 Estruturas Comprovadas para Profissionais em Portugal"),
            ("Secção 'Sobre'", "Narrativa em 4 Atos com Chamada para Ação"),
            ("Caderno de Exercícios", "Planificação de Perfil e Mensagens Prontas")
        ]
    )
    p_lnk.add_title("A Arquitetura de um Perfil Vencedor no LinkedIn")
    p_lnk.add_subtitle("Otimização estratégica para ser encontrado por recrutadores que contratam em Portugal")
    p_lnk.add_callout(
        "O LinkedIn Recruiter funciona através de palavras-chave no Título (Headline), Competências (Skills) e Cargos Anteriores. Quem tem apenas 'Em busca de novo desafio' no título tem uma taxa de clique 85% inferior à de quem declara a sua especialidade objetiva.",
        title="O ALGORITMO DO LINKEDIN RECRUITER",
        variant="info"
    )

    p_lnk.add_heading("1. As 4 Fórmulas de Título de Alto Impacto", level=1)
    p_lnk.add_before_after(
        "Profissional dedicado em busca de novos desafios no mercado de trabalho.",
        "Gestor de Projetos Digitais | Scrum Master (PSM I) | Otimização de Processos B2B e E-Commerce | Porto",
        label_before="Título Fraco / Invisível",
        label_after="Título Fórmulas KEDS (Cargo + Competências + Localização)"
    )

    p_lnk.add_heading("2. A Estrutura da Secção 'Sobre' (About) em 4 Atos", level=1)
    p_lnk.add_bullet("Ato 1 — O Gancho Inicial: Quem sou e qual a minha área de paixão profissional (as primeiras 3 linhas são vitais no mobile).")
    p_lnk.add_bullet("Ato 2 — O Percurso e Realizações: Conquistas práticas com números ou projetos emblemáticos.")
    p_lnk.add_bullet("Ato 3 — Ferramentas e Especialidades: Lista de palavras-chave para o motor de busca do LinkedIn.")
    p_lnk.add_bullet("Ato 4 — Próximo Passo & Contacto: 'Estou disponível para novas oportunidades em regime presencial ou híbrido. Contacto direto: email@dominio.pt'.")

    p_lnk.add_heading("3. Cofre de Abordagens de Networking Direto", level=1)
    p_lnk.add_callout(
        "Mensagem para Recrutador de Empresa em Portugal:\n'Olá [Nome], espero que esteja tudo bem. Acompanho com atenção o crescimento da [Empresa] em Portugal. Sou profissional na área de [Função] com experiência em [Competência]. Vi a recente vaga de [Cargo] e gostaria de confirmar qual o canal ideal para enviar o meu perfil atualizado. Muito obrigado pela atenção!'",
        title="TEMPLATE: ABORDAGEM CIRÚRGICA A RECRUTADORES",
        variant="success"
    )

    p_lnk.add_heading("4. Caderno de Exercícios Práticos para o Teu Perfil", level=1)
    p_lnk.add_worksheet_box("Exercício 1 — Teste de 3 Variações do Teu Título", "Escreve 3 versões de título profissional combinando o teu cargo, especialidade e palavras-chave:", num_lines=3)
    p_lnk.add_worksheet_box("Exercício 2 — Rascunho da Secção 'Sobre'", "Desenvolve o rascunho dos teus 4 parágrafos (Gancho, Percurso, Ferramentas e Contacto):", num_lines=4)
    p_lnk.add_worksheet_box("Exercício 3 — Lista de 10 Empresas Alvo em Portugal", "Lista as 10 empresas que queres acompanhar ativamente e onde pretendes estabelecer contactos:", num_lines=3)

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
    allowed_public = {"cv-essencial-referencia.pdf", "amostra-guia-keds.pdf"}
    for item in PUBLIC_DOWNLOADS_DIR.iterdir():
        if item.is_file() and item.name not in allowed_public:
            item.unlink()
            print(f"  [LIMPEZA] Removido ficheiro pago de public/downloads: {item.name}")

def main():
    print("=== KEDS v5: Geração de Entregáveis Digitais de Alta Fidelidade e Manifesto OKANDA ===")
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
    print("=== Concluído com Sucesso ===")

if __name__ == "__main__":
    main()
