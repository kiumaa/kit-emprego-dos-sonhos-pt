/**
 * Controlador de media sem dependências. Não envia dados nem cria cookies.
 * A função restartWithSound tem de ser chamada diretamente por um clique/tecla.
 */
export type VslPhase = 'idle' | 'preview' | 'ready' | 'starting' | 'playing' | 'paused' | 'ended' | 'error';
export interface VslState {
  mode: 'preview' | 'full';
  phase: VslPhase;
  message: string;
}
export interface VslControllerOptions {
  video: HTMLVideoElement;
  viewportTarget?: Element;
  onState: (state: VslState) => void;
}
export interface VslController {
  restartWithSound: () => void;
  pausePreview: () => void;
  destroy: () => void;
}

export function mountVslController(options: VslControllerOptions): VslController {
  const { video, onState } = options;
  let disposed = false;
  let inView = false;
  let previewStoppedByUser = false;
  let pendingSeek = false;
  let attempt = 0;
  let state: VslState = { mode: 'preview', phase: 'idle', message: '' };
  const motion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false, addEventListener: () => {}, removeEventListener: () => {} };
  const connection = typeof navigator !== 'undefined' ? (navigator as Navigator & { connection?: { saveData?: boolean } }).connection : undefined;
  const listeners: Array<[string, EventListener]> = [];

  const update = (patch: Partial<VslState>) => {
    if (disposed) return;
    state = { ...state, ...patch };
    onState({ ...state });
  };
  const listen = (name: string, listener: EventListener) => {
    video.addEventListener(name, listener);
    listeners.push([name, listener]);
  };

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.controls = false;
  video.loop = true;
  video.preload = 'auto';

  const previewAllowed = () => !motion.matches && !connection?.saveData;
  const tryPreview = () => {
    if (disposed || state.mode !== 'preview' || previewStoppedByUser ||
        (typeof document !== 'undefined' && document.hidden) || !previewAllowed() || state.phase === 'error') return;
    const token = ++attempt;
    video.muted = true;
    video.loop = true;
    void video.play().catch((error: unknown) => {
      if (disposed || token !== attempt || state.mode !== 'preview') return;
      if (error instanceof DOMException && error.name === 'AbortError') return;
      update({ phase: 'ready', message: 'Toca para iniciar o vídeo.' });
    });
  };
  const pauseForContext = () => {
    ++attempt;
    video.pause();
  };

  listen('playing', () => update({ phase: state.mode === 'preview' ? 'preview' : 'playing', message: '' }));
  listen('pause', () => {
    if (state.phase !== 'error' && state.phase !== 'ended') update({ phase: 'paused' });
  });
  listen('ended', () => update({ phase: 'ended', message: '' }));
  listen('error', () => update({ phase: 'error', message: 'Não foi possível carregar o vídeo. Podes tentar novamente ou consultar a oferta abaixo.' }));
  listen('loadedmetadata', () => {
    if (pendingSeek) {
      try { video.currentTime = 0; pendingSeek = false; } catch { /* O play manual continua disponível. */ }
    }
  });

  const observer = typeof window !== 'undefined' && 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    const entry = entries[0];
    inView = Boolean(entry && entry.isIntersecting);
    if (inView) tryPreview();
    else pauseForContext();
  }, { threshold: [0, 0.1] }) : null;
  observer?.observe(options.viewportTarget ?? video);

  // Iniciar preview de imediato se o navegador permitir
  inView = true;
  tryPreview();

  const onVisibility = () => {
    if (typeof document !== 'undefined' && document.hidden) pauseForContext();
    else tryPreview();
  };
  const onMotionChange = () => {
    if (state.mode === 'preview') {
      if (motion.matches) pauseForContext();
      else tryPreview();
    }
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibility);
  }
  motion.addEventListener?.('change', onMotionChange);
  update({ phase: previewAllowed() ? 'preview' : 'ready' });

  return {
    restartWithSound() {
      if (disposed) return;
      const token = ++attempt;
      video.pause();
      update({ mode: 'full', phase: 'starting', message: '' });
      video.loop = false;
      video.controls = false;
      video.defaultMuted = false;
      video.muted = false;
      if (video.error) video.load();
      try { video.currentTime = 0; pendingSeek = false; } catch { pendingSeek = true; }
      void video.play().catch((error: unknown) => {
        if (disposed || token !== attempt) return;
        if (error instanceof DOMException && error.name === 'AbortError') return;
        update({ phase: 'ready', message: 'O navegador não iniciou o som. Toca novamente para reproduzir.' });
      });
    },
    pausePreview() {
      if (state.mode !== 'preview') return;
      previewStoppedByUser = true;
      pauseForContext();
      update({ phase: 'paused', message: 'Pré-visualização em pausa.' });
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      ++attempt;
      observer?.disconnect();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility);
      }
      motion.removeEventListener?.('change', onMotionChange);
      listeners.forEach(([name, listener]) => video.removeEventListener(name, listener));
      video.pause();
    },
  };
}
