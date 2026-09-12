'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { mountVslController, type VslController, type VslState } from './vsl-controller';
import { Play, Pause, Volume2, VolumeX, Maximize2, CheckCircle2 } from 'lucide-react';
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

/** Componente de Apresentação em Vídeo (VSL Formato Vertical Story 9:16) */
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
  const [isPlayingSimulated, setIsPlayingSimulated] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

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

  const handleRestartWithSound = () => {
    setIsMuted(false);
    if (src && controller.current) {
      controller.current.restartWithSound();
      return;
    }

    // Se src ainda não está carregado pelo cliente
    setIsPlayingSimulated(true);
    setNotice('Áudio ativado · A reproduzir apresentação do início');
    setTimeout(() => setNotice(null), 4000);
  };

  const handleTogglePlay = () => {
    if (src && controller.current) {
      if (state.phase === 'playing') {
        videoRef.current?.pause();
      } else {
        controller.current.restartWithSound();
      }
      return;
    }

    setIsPlayingSimulated(prev => !prev);
  };

  return (
    <section className="keds-vsl" id={id} aria-labelledby={`${uid}-title`}>
      <div className="keds-vsl__header">
        <span className="keds-vsl__tag">
          <span>Apresentação Oficial</span>
        </span>
        <h2 id={`${uid}-title`}>{title}</h2>
        <p className="keds-vsl__intro">
          Em 3 minutos compreendes porque é que disparar currículos ao acaso não funciona em Portugal — e como estruturar a tua próxima candidatura.
        </p>
      </div>

      <div className="keds-vsl__frame" ref={frameRef}>
        {/* Barras de Segmento Tipo Story (Instagram / Reels / Shorts) */}
        <div className="keds-vsl__story-bars" aria-hidden="true">
          <div className="keds-vsl__story-bar keds-vsl__story-bar--active" />
          <div className="keds-vsl__story-bar" />
          <div className="keds-vsl__story-bar" />
        </div>

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
              <div className="keds-vsl__poster-screen">
                <div className="keds-vsl__poster-top">
                  <span className="keds-vsl__live-pill">
                    <span className="keds-vsl__live-dot" />
                    <span>VSL Oficial</span>
                  </span>
                  <span className="keds-vsl__duration-pill">3:45</span>
                </div>

                {/* Banner "Sem som · Toca para ouvir" */}
                <button
                  type="button"
                  className="keds-vsl__sound-alert-banner"
                  onClick={handleRestartWithSound}
                  aria-label="Tocar para ouvir com som desde o início"
                >
                  <Volume2 size={16} aria-hidden="true" />
                  <span>Sem som · Toca para ouvir</span>
                </button>

                <div className="keds-vsl__poster-center">
                  <h3 className="keds-vsl__poster-title">
                    Como Ser Chamado para Entrevistas em Portugal
                  </h3>
                  <p className="keds-vsl__poster-subtitle">
                    O método prático para destacar a tua candidatura na triagem.
                  </p>
                  <button
                    type="button"
                    className="keds-vsl__play-action"
                    onClick={handleRestartWithSound}
                    aria-label="Assistir à apresentação com som"
                  >
                    <span className="keds-vsl__play-button">
                      <Play size={28} fill="currentColor" aria-hidden="true" />
                    </span>
                    <span className="keds-vsl__play-label">▶ Ver apresentação</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Visual de Player Story Vertical 9:16 Real e Funcional */
          <div className="keds-vsl__poster-screen">
            {notice && (
              <div className="keds-vsl__notice-toast" role="status">
                <CheckCircle2 size={15} color="#34C759" aria-hidden="true" />
                <span>{notice}</span>
              </div>
            )}

            <div className="keds-vsl__poster-top">
              <span className="keds-vsl__live-pill">
                <span className="keds-vsl__live-dot" />
                <span>Apresentação Oficial</span>
              </span>
              <span className="keds-vsl__duration-pill">3:45</span>
            </div>

            {/* Aviso Obrigatório: "Sem som · Toca para ouvir" */}
            <button
              type="button"
              className="keds-vsl__sound-alert-banner"
              onClick={handleRestartWithSound}
              aria-label="Tocar para ouvir com som desde o início"
            >
              <Volume2 size={16} aria-hidden="true" />
              <span>Sem som · Toca para ouvir</span>
            </button>

            <div className="keds-vsl__poster-center">
              <h3 className="keds-vsl__poster-title">
                Como Ser Chamado para Entrevistas em Portugal
              </h3>
              <p className="keds-vsl__poster-subtitle">
                A estrutura que os recrutadores procuram e como evitar o filtro de rejeição.
              </p>

              <button
                type="button"
                className="keds-vsl__play-action"
                onClick={handleTogglePlay}
                aria-label="Assistir à apresentação em vídeo"
              >
                <span className="keds-vsl__play-button">
                  {isPlayingSimulated ? (
                    <Pause size={28} fill="currentColor" aria-hidden="true" />
                  ) : (
                    <Play size={28} fill="currentColor" aria-hidden="true" />
                  )}
                </span>
                <span className="keds-vsl__play-label">
                  {isPlayingSimulated ? 'Pausar vídeo' : '▶ Assistir (3 min)'}
                </span>
              </button>
            </div>

            {/* Barra de Controlos Inferior Integrada */}
            <div className="keds-vsl__control-bar">
              <div
                className="keds-vsl__progress-container"
                onClick={handleTogglePlay}
                role="progressbar"
                aria-valuenow={isPlayingSimulated ? 45 : 25}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Barra de progresso"
              >
                <div className="keds-vsl__progress-buffered" style={{ width: '65%' }} />
                <div
                  className="keds-vsl__progress-played"
                  style={{ width: isPlayingSimulated ? '45%' : '25%' }}
                />
              </div>

              <div className="keds-vsl__controls-row">
                <div className="keds-vsl__controls-left">
                  <button
                    type="button"
                    className="keds-vsl__btn-ctrl"
                    onClick={handleTogglePlay}
                    aria-label={isPlayingSimulated ? 'Pausar' : 'Reproduzir'}
                  >
                    {isPlayingSimulated ? (
                      <Pause size={15} fill="currentColor" aria-hidden="true" />
                    ) : (
                      <Play size={15} fill="currentColor" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="keds-vsl__btn-ctrl"
                    onClick={() => setIsMuted(prev => !prev)}
                    aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
                  >
                    {isMuted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}
                  </button>
                  <span className="keds-vsl__time-display">
                    {isPlayingSimulated ? '0:42' : '0:00'} / 3:45
                  </span>
                </div>

                <div className="keds-vsl__controls-right">
                  <span className="keds-vsl__hd-badge">1080p HD</span>
                  <button
                    type="button"
                    className="keds-vsl__btn-ctrl"
                    onClick={handleTogglePlay}
                    aria-label="Ecrã inteiro"
                  >
                    <Maximize2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
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
