import { describe, it, expect } from 'vitest';
import { parseDocument } from '../document-parser';

describe('Document Parser (Real Parsing, Security, & Error Boundaries)', () => {
  it('rejects empty files', async () => {
    const res = await parseDocument(Buffer.from(''), 'curriculo.pdf');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('PARSE_FAILED');
  });

  it('rejects files larger than 5MB', async () => {
    const hugeBuffer = Buffer.alloc(5 * 1024 * 1024 + 10);
    const res = await parseDocument(hugeBuffer, 'curriculo.pdf');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('FILE_TOO_LARGE');
    expect(res.allowPaste).toBe(true);
  });

  it('rejects unsupported extensions or formats', async () => {
    const buffer = Buffer.from('algum conteudo qualquer');
    const res = await parseDocument(buffer, 'curriculo.exe');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('INVALID_FORMAT');
    expect(res.allowPaste).toBe(true);
  });

  it('rejects PDF file if header magic bytes are not %PDF', async () => {
    const fakePdf = Buffer.from('isto nao e um pdf verdadeiro com magic bytes');
    const res = await parseDocument(fakePdf, 'curriculo.pdf', 'application/pdf');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('INVALID_FORMAT');
  });

  it('rejects DOCX file if header magic bytes are not PK', async () => {
    const fakeDocx = Buffer.from('isto nao e um docx zip valido');
    const res = await parseDocument(fakeDocx, 'curriculo.docx');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('INVALID_FORMAT');
  });

  it('extracts valid text from a plain text file', async () => {
    const textContent = 'Ana Silva\nEngenheira de Software com 5 anos de experiência em Lisboa e Porto em desenvolvimento web e cloud.';
    const buffer = Buffer.from(textContent, 'utf-8');
    const res = await parseDocument(buffer, 'curriculo.txt');
    expect(res.success).toBe(true);
    expect(res.text).toContain('Engenheira de Software');
  });

  it('honestly reports when extracted text is too short (<40 chars) and offers Quiz fallback', async () => {
    const shortText = 'CV Ana';
    const buffer = Buffer.from(shortText, 'utf-8');
    const res = await parseDocument(buffer, 'curriculo.txt');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('NO_TEXT_EXTRACTED');
    expect(res.offerQuiz).toBe(true);
    expect(res.allowPaste).toBe(true);
  });
});
