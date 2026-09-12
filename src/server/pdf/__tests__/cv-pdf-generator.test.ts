import { describe, it, expect } from 'vitest';
import { generateCvPdf, CVDraftData } from '../cv-pdf-generator';
import { parseDocument } from '../../diagnostics/document-parser';

const mockCv: CVDraftData = {
  schemaVersion: 1,
  template: 'essencial',
  personal: {
    name: 'Inês Exemplo',
    email: 'ines@example.com',
    city: 'Lisboa',
    targetRole: 'Assistente de Atendimento',
  },
  summary: 'Profissional dedicada com experiência em receção e atendimento ao público.',
  experience: [
    {
      id: 'exp-1',
      role: 'Assistente de Atendimento',
      organization: 'Empresa Modelo Lda',
      start: '2023-01',
      end: '2025-12',
      bullets: [
        'Atendimento presencial e telefónico de clientes.',
        'Organização e triagem de pedidos diários.',
      ],
    },
  ],
  education: [
    {
      qualification: 'Ensino Secundário',
      institution: 'Escola Secundária de Lisboa',
      period: '2022',
    },
  ],
  skills: ['Atendimento', 'Comunicação', 'Organização'],
};

describe('cv-pdf-generator', () => {
  it('gera PDF válido e legível', async () => {
    const buffer = generateCvPdf(mockCv);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(500);
    expect(buffer.subarray(0, 5).toString('ascii')).toBe('%PDF-');

    // Testar com o nosso document-parser oficial
    const result = await parseDocument(buffer, 'curriculo.pdf', 'application/pdf');
    expect(result.success).toBe(true);
    expect(result.text).toContain('Inês Exemplo');
    expect(result.text).toContain('Assistente de Atendimento');
    expect(result.text).toContain('Lisboa');
    expect(result.text).toContain('Empresa Modelo Lda');
  });

  it('gera modelo moderno sem erros', async () => {
    const buffer = generateCvPdf({ ...mockCv, template: 'moderno' });
    expect(buffer).toBeInstanceOf(Buffer);
    const result = await parseDocument(buffer, 'curriculo_moderno.pdf', 'application/pdf');
    expect(result.success).toBe(true);
    expect(result.text).toContain('Inês Exemplo');
  });
});
