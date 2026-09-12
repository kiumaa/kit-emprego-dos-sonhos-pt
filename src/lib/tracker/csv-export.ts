import { ApplicationRecord } from '../../../contracts/domain';

/**
 * Sanitiza um valor individual para evitar Formula Injection (CSV Injection / CWE-1236).
 * Se o campo começar com '=', '+', '-', '@', '\t', '\r', prefixa com apóstrofo "'".
 * Assegura o escape correto de aspas duplas segundo a RFC 4180.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // Prevenir injeção de fórmulas ativas
  const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousPrefixes.some((p) => str.startsWith(p))) {
    str = `'${str}`;
  }

  // Escapar aspas duplas (RFC 4180)
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Exporta uma lista de candidaturas para o formato CSV compatível com Excel/Numbers/Sheets.
 */
export function exportApplicationsToCsv(applications: ApplicationRecord[]): string {
  const headers = [
    'Empresa',
    'Função',
    'Ligação da Vaga',
    'Estado',
    'Data de Envio',
    'Próximo Passo',
    'Data do Próximo Passo',
    'Notas',
  ];

  const stateLabels: Record<ApplicationRecord['state'], string> = {
    preparing: 'A preparar',
    sent: 'Enviada',
    interview: 'Entrevista',
    offer: 'Proposta',
    closed: 'Concluída',
  };

  const rows = applications.map((app) => [
    sanitizeCsvCell(app.company),
    sanitizeCsvCell(app.role),
    sanitizeCsvCell(app.url || ''),
    sanitizeCsvCell(stateLabels[app.state] || app.state),
    sanitizeCsvCell(app.sentDate || ''),
    sanitizeCsvCell(app.nextAction),
    sanitizeCsvCell(app.nextActionDate || ''),
    sanitizeCsvCell(app.notes),
  ]);

  const csvLines = [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))];

  return csvLines.join('\r\n');
}

export const generateSanitizedCsv = exportApplicationsToCsv;
