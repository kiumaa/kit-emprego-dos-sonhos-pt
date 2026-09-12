'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { mountVslController, type VslController, type VslState } from './vsl-controller';
import { Play, Volume2 } from 'lucide-react';
import './vsl-player.css';

export interface VslPlayerProps {
  src?: string | null;
  poster?: string | null;
  captionsSrc?: string | null;
  transcript?: string;
  id?: string;
  title?: string;
}

const initialState: VslState = { mode: 'preview', phase: 'idle', message: '' };

/** Componente de Apresentação em Vídeo (VSL Protagonista) */
export function VslPlayer({
  src,
  poster,
  captionsSrc,
  transcript,
  id = 'apresentacao',
  title = 'Antes de enviares a próxima candidatura, vê isto.',
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
      video,
      viewportTarget: frameRef.current ?? video,
      onState: setState,
    });
    return () => {
      controller.current?.destroy();
      controller.current = null;
    };
  }, [src]);

  return (
    <section className="keds-vsl" id={id} aria-labelledby={`${uid}-title`}>
      <div className="keds-vsl__header">
        <span className="keds-vsl__tag">Apresentação Oficial</span>
        <h2 id={`${uid}-title`}>{title}</h2>
        <p className="keds-vsl__intro">
          Em poucos minutos mostramos-te como usar o Kit Emprego dos Sonhos para preparar melhor todo o processo.
        </p>
      </div>

      <div className="keds-vsl__frame" ref={frameRef}>
        {src ? (
          <>
            <video
              key={src}
              ref={videoRef}
              src={src}
              poster={poster ?? undefined}
              playsInline
              preload="metadata"
              aria-label="Apresentação do Kit Emprego dos Sonhos"
              aria-describedby={`${uid}-status`}
            >
              {captionsSrc && (
                <track kind="captions" src={captionsSrc} srcLang="pt-PT" label="Português" default />
              )}
              O teu navegador não suporta este vídeo.
            </video>
            {(state.mode === 'preview' || ['error', 'ready'].includes(state.phase)) && (
              <div className="keds-vsl__overlay">
                <button
                  type="button"
                  className="keds-vsl__start"
                  onClick={() => controller.current?.restartWithSound()}
                >
                  <Volume2 size={20} aria-hidden="true" />
                  <span>🔊 Ativar som e ver desde o início</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="keds-vsl__placeholder">
            <div className="keds-vsl__placeholder-content">
              <div className="keds-vsl__placeholder-play">
                <Play size={28} fill="currentColor" aria-hidden="true" />
              </div>
              <span className="keds-vsl__placeholder-label">
                Vídeo de apresentação em preparação
              </span>
              <p className="keds-vsl__placeholder-sub">
                Consulta os detalhes e recursos completos do kit logo abaixo.
              </p>
            </div>
          </div>
        )}
      </div>

      {src && (
        <p className="keds-vsl__status" id={`${uid}-status`} role="status" aria-live="polite">
          {state.message ||
            (state.mode === 'preview' ? 'Ao ativar o som, o vídeo recomeça do princípio.' : '')}
        </p>
      )}

      {transcript && (
        <details className="keds-vsl__transcript">
          <summary>Ler a transcrição da apresentação</summary>
          <p>{transcript}</p>
        </details>
      )}
    </section>
  );
}
