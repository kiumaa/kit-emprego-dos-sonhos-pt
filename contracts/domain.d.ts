/** Internal domain contracts — KEDS v3 (Funil + Entrega OKANDA) */
export type ProductId = 'kit-emprego-pt' | 'entrevista' | 'linkedin';
export type DiagnosticSource = 'cv' | 'quiz';

export interface Money {
  currency: 'EUR';
  amountMinor: number;
  formatted: string;
}

export interface DiagnosticPriority {
  criterion: string;
  title: string;
  action: string;
  explanation?: string;
  kind: 'essential' | 'refinement';
  evidenceAnswer?: string;
  evidenceText?: string;
  source: string;
}

export interface UnifiedDiagnosticResult {
  id: string;
  source: DiagnosticSource;
  title: string;
  summary: string;
  disclaimer: string;
  priorities: DiagnosticPriority[];
  freeAction: {
    title: string;
    description: string;
    actionLabel: string;
    actionType: 'download_sample' | 'guide_step';
    sampleUrl?: string;
  };
  createdAt: string;
  targetRole?: string;
  hasJobDescription?: boolean;
}

export interface CheckoutConfig {
  provider: 'okanda';
  url: string | null;
  allowedHosts: string[];
  deliveryOwner: 'okanda';
  selectionOfBumps: 'okanda-only';
}

export interface VslConfig {
  src: string | null;
  poster: string | null;
  captionsSrc: string | null;
  anchor: string;
  autoplay: 'muted-when-visible';
  restartOnSoundActivation: boolean;
}

export interface AnalysisProvider {
  analyze(input: {
    cvText: string;
    targetRole?: string;
    jobDescription?: string;
    requestId: string;
  }): Promise<UnifiedDiagnosticResult>;
}

export interface ApplicationRecord {
  id: string;
  userId?: string;
  company: string;
  role: string;
  url?: string | null;
  state: 'preparing' | 'sent' | 'interview' | 'offer' | 'closed';
  sentDate?: string | null;
  nextAction: string;
  nextActionDate?: string | null;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Sem contratos de CvEditor, contas locais, encomendas locais ou biblioteca privada online. */
