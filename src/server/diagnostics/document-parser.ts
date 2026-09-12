import './polyfills';
import mammoth from 'mammoth';

export interface DocumentParseResult {
  success: boolean;
  text: string;
  error?: string;
  errorCode?: 'FILE_TOO_LARGE' | 'INVALID_FORMAT' | 'NO_TEXT_EXTRACTED' | 'PARSE_FAILED';
  allowPaste?: boolean;
  offerQuiz?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MiB
const MIN_EXTRACTED_CHARS = 40;
const MAX_EXTRACTED_CHARS = 32000;

export async function parseDocument(fileBuffer: Buffer, fileName: string, mimeType?: string): Promise<DocumentParseResult> {
  if (!fileBuffer || fileBuffer.length === 0) {
    return {
      success: false,
      text: '',
      error: 'O ficheiro enviado está vazio.',
      errorCode: 'PARSE_FAILED',
    };
  }

  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      text: '',
      error: 'O ficheiro excede o tamanho máximo permitido de 5 MiB. Podes reduzir o ficheiro ou colar o texto diretamente.',
      errorCode: 'FILE_TOO_LARGE',
      allowPaste: true,
    };
  }

  const lowerName = fileName.toLowerCase();
  let extractedText = '';

  try {
    if (lowerName.endsWith('.pdf') || mimeType === 'application/pdf') {
      // Validação de assinatura PDF (%PDF-)
      const header = fileBuffer.subarray(0, 5).toString('ascii');
      if (!header.startsWith('%PDF')) {
        return {
          success: false,
          text: '',
          error: 'O ficheiro não é um documento PDF válido.',
          errorCode: 'INVALID_FORMAT',
          allowPaste: true,
        };
      }

      try {
        // @ts-expect-error - worker mjs sem tipos dedicados
        const worker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
        (globalThis as any).pdfjsWorker = worker;
      } catch {
        // Fallback se o import falhar
      }
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: fileBuffer });
      const result = await parser.getText();
      await parser.destroy();
      extractedText = (result.text || '').trim();
    } else if (
      lowerName.endsWith('.docx') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // Validação de assinatura ZIP (PK..)
      const header = fileBuffer.subarray(0, 2).toString('ascii');
      if (header !== 'PK') {
        return {
          success: false,
          text: '',
          error: 'O ficheiro não é um documento DOCX (OpenXML) válido.',
          errorCode: 'INVALID_FORMAT',
          allowPaste: true,
        };
      }

      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = (result.value || '').trim();
    } else if (lowerName.endsWith('.txt') || mimeType === 'text/plain') {
      extractedText = fileBuffer.toString('utf-8').trim();
    } else {
      return {
        success: false,
        text: '',
        error: 'Formato não suportado. Por favor envia um ficheiro em PDF, DOCX ou TXT, ou cola o texto.',
        errorCode: 'INVALID_FORMAT',
        allowPaste: true,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      text: '',
      error: `Não foi possível ler o ficheiro: ${msg}. Podes colar o texto do teu CV ou fazer o Quiz gratuito.`,
      errorCode: 'PARSE_FAILED',
      allowPaste: true,
      offerQuiz: true,
    };
  }

  // Sanitização básica de espaçamento
  extractedText = extractedText.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/ +/g, ' ');

  if (extractedText.length < MIN_EXTRACTED_CHARS) {
    return {
      success: false,
      text: '',
      error: 'Não foi possível extrair texto legível suficiente deste documento (pode ser uma imagem digitalizada ou estar protegido). Podes colar o texto diretamente ou responder ao Quiz gratuito de 5 perguntas.',
      errorCode: 'NO_TEXT_EXTRACTED',
      allowPaste: true,
      offerQuiz: true,
    };
  }

  // Truncar para limite de segurança
  if (extractedText.length > MAX_EXTRACTED_CHARS) {
    extractedText = extractedText.slice(0, MAX_EXTRACTED_CHARS);
  }

  return {
    success: true,
    text: extractedText,
  };
}
