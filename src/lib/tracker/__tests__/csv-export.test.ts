import { describe, it, expect } from 'vitest';
import { sanitizeCsvCell, exportApplicationsToCsv } from '../csv-export';
import { ApplicationRecord } from '../../../../contracts/domain';

describe('Sanitização e Exportação de CSV (Segurança contra Formula Injection)', () => {
  it('escapa fórmulas perigosas iniciadas por =, +, -, @', () => {
    expect(sanitizeCsvCell('=cmd|"/C calc"!A0')).toBe(`"'=cmd|""/C calc""!A0"`);
    expect(sanitizeCsvCell('+12345')).toBe(`"'+12345"`);
    expect(sanitizeCsvCell('-500')).toBe(`"'-500"`);
    expect(sanitizeCsvCell('@SUM(A1:A10)')).toBe(`"'@SUM(A1:A10)"`);
  });

  it('mantém texto normal e aspas duplas escapadas corretamente', () => {
    expect(sanitizeCsvCell('Empresa Normal Lda')).toBe(`"Empresa Normal Lda"`);
    expect(sanitizeCsvCell('Disseram "ligamos amanhã"')).toBe(`"Disseram ""ligamos amanhã"""`);
    expect(sanitizeCsvCell(null)).toBe('""');
  });

  it('gera CSV com cabeçalhos e linhas corretas', () => {
    const apps: ApplicationRecord[] = [
      {
        id: 'app-1',
        userId: 'user-1',
        company: 'Tech Solutions',
        role: 'Desenvolvedor Frontend',
        url: 'https://exemplo.pt/vaga/123',
        state: 'sent',
        sentDate: '2026-09-10',
        nextAction: 'Acompanhar por email',
        nextActionDate: '2026-09-17',
        notes: 'Enviado com CV Moderno',
      },
      {
        id: 'app-2',
        userId: 'user-1',
        company: '=MALICIOUS',
        role: 'Gestor',
        url: null,
        state: 'preparing',
        sentDate: null,
        nextAction: 'Terminar carta',
        nextActionDate: null,
        notes: '',
      },
    ];

    const csv = exportApplicationsToCsv(apps);
    const lines = csv.split('\r\n');

    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain('"Empresa","Função"');
    expect(lines[1]).toContain('"Tech Solutions","Desenvolvedor Frontend"');
    expect(lines[2]).toContain(`"'=MALICIOUS"`); // Sanitizado!
  });
});
