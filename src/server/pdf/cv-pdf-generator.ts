/**
 * Gerador de PDF A4 em TypeScript puro para CVs.
 * Compatível com PDF 1.4, sem dependências externas pesadas nem browsers headless.
 * Produz PDF vetorial com texto pesquisável/selecionável e sem marcas comerciais KEDS.
 */

export interface CVDraftData {
  schemaVersion: 1;
  template: 'essencial' | 'moderno';
  personal: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    targetRole?: string;
    photoAssetId?: string | null;
  };
  summary: string;
  experience: Array<{
    id: string;
    role: string;
    organization: string;
    start: string;
    end?: string | null;
    bullets: string[];
  }>;
  education: Array<{
    qualification: string;
    institution: string;
    period?: string;
  }>;
  skills: string[];
}

// Mapa de caracteres especiais em português para WinAnsiEncoding
function encodePdfText(str: string): string {
  if (!str) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Escapar parênteses e barra invertida
    if (code === 40) {
      result += '\\(';
    } else if (code === 41) {
      result += '\\)';
    } else if (code === 92) {
      result += '\\\\';
    } else if (code >= 32 && code <= 126) {
      result += str[i];
    } else if (code >= 160 && code <= 255) {
      // Caracteres WinAnsi padrão ISO-8859-1 (inclui á, à, ã, é, ê, í, ó, ô, õ, ú, ç, Á, É, etc.)
      result += '\\' + code.toString(8).padStart(3, '0');
    } else {
      // Fallback para caracteres fora do intervalo básico
      result += ' ';
    }
  }
  return result;
}

export function generateCvPdf(data: CVDraftData): Buffer {
  const isModern = data.template === 'moderno';
  const width = 595.28;
  const height = 841.89;
  const margin = 48;
  const contentWidth = width - margin * 2;

  const ops: string[] = [];

  let curY = height - 54;

  if (isModern) {
    // Cabeçalho moderno com faixa subtil em cinzento escuro / grafite
    ops.push('q');
    ops.push('0.114 0.114 0.122 rg'); // #1D1D1F
    ops.push(`0 ${height - 90} ${width} 90 re f`);
    ops.push('Q');

    // Nome em branco
    ops.push('BT');
    ops.push('/F2 20 Tf');
    ops.push('1 1 1 rg'); // Branco
    ops.push(`${margin} ${height - 42} Td`);
    ops.push(`(${encodePdfText(data.personal.name || 'Nome do Candidato')}) Tj`);
    ops.push('ET');

    // Cargo em branco suave
    if (data.personal.targetRole) {
      ops.push('BT');
      ops.push('/F1 11 Tf');
      ops.push('0.9 0.9 0.9 rg');
      ops.push(`${margin} ${height - 60} Td`);
      ops.push(`(${encodePdfText(data.personal.targetRole)}) Tj`);
      ops.push('ET');
    }

    // Contactos
    const contacts: string[] = [];
    if (data.personal.city) contacts.push(data.personal.city);
    if (data.personal.email) contacts.push(data.personal.email);
    if (data.personal.phone) contacts.push(data.personal.phone);

    if (contacts.length > 0) {
      ops.push('BT');
      ops.push('/F1 9 Tf');
      ops.push('0.8 0.8 0.8 rg');
      ops.push(`${margin} ${height - 76} Td`);
      ops.push(`(${encodePdfText(contacts.join('  |  '))}) Tj`);
      ops.push('ET');
    }

    curY = height - 120;
  } else {
    // Modelo Essencial: clássico, editorial e elegante
    ops.push('BT');
    ops.push('/F2 22 Tf');
    ops.push('0.114 0.114 0.122 rg'); // #1D1D1F
    ops.push(`${margin} ${curY} Td`);
    ops.push(`(${encodePdfText(data.personal.name || 'Nome do Candidato')}) Tj`);
    ops.push('ET');
    curY -= 20;

    if (data.personal.targetRole) {
      ops.push('BT');
      ops.push('/F2 12 Tf');
      ops.push('0 0.341 0.851 rg'); // Azul #0057D9
      ops.push(`${margin} ${curY} Td`);
      ops.push(`(${encodePdfText(data.personal.targetRole.toUpperCase())}) Tj`);
      ops.push('ET');
      curY -= 18;
    }

    const contacts: string[] = [];
    if (data.personal.city) contacts.push(data.personal.city);
    if (data.personal.email) contacts.push(data.personal.email);
    if (data.personal.phone) contacts.push(data.personal.phone);

    if (contacts.length > 0) {
      ops.push('BT');
      ops.push('/F1 9.5 Tf');
      ops.push('0.318 0.318 0.353 rg'); // #51515A
      ops.push(`${margin} ${curY} Td`);
      ops.push(`(${encodePdfText(contacts.join('   •   '))}) Tj`);
      ops.push('ET');
      curY -= 16;
    }

    // Linha divisória fina
    ops.push('q');
    ops.push('0.85 0.85 0.87 RG');
    ops.push('0.75 w');
    ops.push(`${margin} ${curY} m ${width - margin} ${curY} l S`);
    ops.push('Q');
    curY -= 22;
  }

  // Função auxiliar para secções
  const drawSectionTitle = (title: string) => {
    ops.push('BT');
    ops.push('/F2 11 Tf');
    ops.push('0.114 0.114 0.122 rg');
    ops.push(`${margin} ${curY} Td`);
    ops.push(`(${encodePdfText(title.toUpperCase())}) Tj`);
    ops.push('ET');

    // Linha de apoio sob título
    ops.push('q');
    ops.push('0 0.341 0.851 RG');
    ops.push('1.5 w');
    ops.push(`${margin} ${curY - 4} m ${margin + 40} ${curY - 4} l S`);
    ops.push('Q');

    curY -= 18;
  };

  // 1. Resumo / Perfil
  if (data.summary && data.summary.trim()) {
    drawSectionTitle('Perfil Profissional');
    const words = data.summary.trim().split(/\s+/);
    let line = '';
    const maxLineLen = 85;

    for (const word of words) {
      if ((line + ' ' + word).length > maxLineLen) {
        ops.push('BT');
        ops.push('/F1 9.5 Tf');
        ops.push('0.2 0.2 0.2 rg');
        ops.push(`${margin} ${curY} Td`);
        ops.push(`(${encodePdfText(line.trim())}) Tj`);
        ops.push('ET');
        curY -= 13;
        line = word;
      } else {
        line = line ? line + ' ' + word : word;
      }
    }
    if (line) {
      ops.push('BT');
      ops.push('/F1 9.5 Tf');
      ops.push('0.2 0.2 0.2 rg');
      ops.push(`${margin} ${curY} Td`);
      ops.push(`(${encodePdfText(line.trim())}) Tj`);
      ops.push('ET');
      curY -= 13;
    }
    curY -= 12;
  }

  // 2. Experiência
  if (Array.isArray(data.experience) && data.experience.length > 0) {
    drawSectionTitle('Experiência Profissional');

    for (const exp of data.experience) {
      // Título e Organização
      ops.push('BT');
      ops.push('/F2 10 Tf');
      ops.push('0.114 0.114 0.122 rg');
      ops.push(`${margin} ${curY} Td`);
      ops.push(`(${encodePdfText(exp.role || '')}) Tj`);
      ops.push('ET');

      // Datas à direita
      const periodStr = `${exp.start || ''} — ${exp.end || 'Presente'}`;
      ops.push('BT');
      ops.push('/F1 9 Tf');
      ops.push('0.4 0.4 0.4 rg');
      ops.push(`${width - margin - 100} ${curY} Td`);
      ops.push(`(${encodePdfText(periodStr)}) Tj`);
      ops.push('ET');
      curY -= 13;

      // Organização
      if (exp.organization) {
        ops.push('BT');
        ops.push('/F1 9 Tf');
        ops.push('0 0.341 0.851 rg');
        ops.push(`${margin} ${curY} Td`);
        ops.push(`(${encodePdfText(exp.organization)}) Tj`);
        ops.push('ET');
        curY -= 13;
      }

      // Bullets
      if (Array.isArray(exp.bullets)) {
        for (const bullet of exp.bullets) {
          if (!bullet || !bullet.trim()) continue;
          ops.push('BT');
          ops.push('/F1 9 Tf');
          ops.push('0.25 0.25 0.25 rg');
          ops.push(`${margin + 8} ${curY} Td`);
          ops.push(`(- ${encodePdfText(bullet.trim())}) Tj`);
          ops.push('ET');
          curY -= 12;
        }
      }
      curY -= 8;
    }
  }

  // 3. Educação
  if (Array.isArray(data.education) && data.education.length > 0) {
    drawSectionTitle('Educação e Formação');
    for (const edu of data.education) {
      ops.push('BT');
      ops.push('/F2 9.5 Tf');
      ops.push('0.114 0.114 0.122 rg');
      ops.push(`${margin} ${curY} Td`);
      ops.push(`(${encodePdfText(edu.qualification)}) Tj`);
      ops.push('ET');

      if (edu.period) {
        ops.push('BT');
        ops.push('/F1 8.5 Tf');
        ops.push('0.4 0.4 0.4 rg');
        ops.push(`${width - margin - 70} ${curY} Td`);
        ops.push(`(${encodePdfText(edu.period)}) Tj`);
        ops.push('ET');
      }
      curY -= 12;

      if (edu.institution) {
        ops.push('BT');
        ops.push('/F1 8.5 Tf');
        ops.push('0.35 0.35 0.35 rg');
        ops.push(`${margin} ${curY} Td`);
        ops.push(`(${encodePdfText(edu.institution)}) Tj`);
        ops.push('ET');
        curY -= 13;
      }
      curY -= 4;
    }
  }

  // 4. Competências
  if (Array.isArray(data.skills) && data.skills.length > 0) {
    drawSectionTitle('Competências Principais');
    const skillsText = data.skills.filter(Boolean).join('   •   ');
    ops.push('BT');
    ops.push('/F1 9 Tf');
    ops.push('0.25 0.25 0.25 rg');
    ops.push(`${margin} ${curY} Td`);
    ops.push(`(${encodePdfText(skillsText)}) Tj`);
    ops.push('ET');
    curY -= 16;
  }

  const contentStream = ops.join('\n');
  const streamLen = Buffer.byteLength(contentStream, 'latin1');

  // Construir objetos PDF 1.4
  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objects[3] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`;
  objects[4] = `<< /Length ${streamLen} >>\nstream\n${contentStream}\nendstream`;
  objects[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

  let pdfOutput = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [];

  for (let i = 1; i <= 6; i++) {
    offsets[i] = Buffer.byteLength(pdfOutput, 'latin1');
    pdfOutput += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdfOutput, 'latin1');
  pdfOutput += 'xref\n0 7\n';
  pdfOutput += '0000000000 65535 f \n';
  for (let i = 1; i <= 6; i++) {
    pdfOutput += offsets[i].toString().padStart(10, '0') + ' 00000 n \n';
  }

  pdfOutput += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdfOutput, 'latin1');
}
