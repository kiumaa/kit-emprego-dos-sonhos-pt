'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { mountVslController, type VslController, type VslState } from './vsl-controller';
import './vsl-player.css';

export interface VslPlayerProps {
  src?: string | null;
  poster?: string;
  captionsSrc?: string;
  transcript?: string;
  id?: string;
  title?: string;
}
const initialState: VslState = { mode: 'preview', phase: 'idle', message: '' };

/** Apenas apresentação de vídeo. A oferta e o link OKANDA ficam fora deste componente. */
export function VslPlayer({
  src, poster, captionsSrc, transcript,
  id = 'apresentacao', title = 'Transforma o teu próximo passo numa candidatura preparada.',
}: VslPlayerProps) {
  const uid = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const controller = useRef<VslController | null>(null);
  const [state, setState] = useState<VslState>(initialState);

  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;
    controller.current = mountVslController({
      video, viewportTarget: frameRef.current ?? video, onState: setState,
    });
    return () => { controller.current?.destroy(); controller.current = null; };
  }, [src]);

  if (!src) {
    return (
      <section className="keds-vsl keds-vsl--empty" id={id} aria-labelledby={`${uid}-title`}>
        <h2 id={`${uid}-title`}>{title}</h2>
        <p>A apresentação em vídeo está em preparação. Podes consultar já o conteúdo do kit abaixo.</p>
      </section>
    );
  }

  const showStart = state.mode === 'preview' || ['error', 'ready'].includes(state.phase);
  const buttonText = state.phase === 'error' ? 'Tentar reproduzir novamente'
    : state.mode === 'full' ? 'Reproduzir com som desde o início'
    : 'Ativar som e ver desde o início';

  return (
    <section className="keds-vsl" id={id} aria-labelledby={`${uid}-title`}>
      <h2 id={`${uid}-title`}>{title}</h2>
      <p className="keds-vsl__intro">Conhece os recursos do Kit Emprego dos Sonhos — Portugal.</p>
      <div className="keds-vsl__frame" ref={frameRef}>
        <video key={src} ref={videoRef} src={src} poster={poster}
          playsInline preload="metadata" aria-label="Apresentação do Kit Emprego dos Sonhos"
          aria-describedby={`${uid}-status`}>
          {captionsSrc && <track kind="captions" src={captionsSrc} srcLang="pt-PT" label="Português" default />}
          O teu navegador não suporta este vídeo.
        </video>
        {showStart && (
          <div className="keds-vsl__overlay">
            {state.phase === 'preview' && <span className="keds-vsl__badge">Pré-visualização sem som</span>}
            <button type="button" className="keds-vsl__start"
              onClick={() => controller.current?.restartWithSound()}>
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="m9 5 10 7-10 7V5Z" fill="currentColor" />
              </svg>
              {buttonText}
            </button>
            {state.phase === 'preview' && <button type="button" className="keds-vsl__pause"
              onClick={() => controller.current?.pausePreview()}>Pausar pré-visualização</button>}
          </div>
        )}
      </div>
      <p className="keds-vsl__status" id={`${uid}-status`} role="status" aria-live="polite">
        {state.message || (state.mode === 'preview' ? 'Ao ativar o som, o vídeo recomeça do princípio.' : '')}
      </p>
      {transcript && <details className="keds-vsl__transcript"><summary>Ler a transcrição</summary><p>{transcript}</p></details>}
    </section>
  );
}
