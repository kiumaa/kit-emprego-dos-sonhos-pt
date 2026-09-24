'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { mountVslController, type VslController, type VslState } from './vsl-controller';
import { Play, Pause, Volume2, VolumeX, Maximize2, ArrowDown, ArrowRight } from 'lucide-react';
import { getValidatedCheckoutUrl } from '@/lib/funnel-config';
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

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

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

  // Estados reais do elemento de vídeo quando src está presente
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);
  const [showCta, setShowCta] = useState(false);

  const checkout = getValidatedCheckoutUrl();
  const isExternalCheckout = checkout.isConfigured && Boolean(checkout.url);
  const checkoutHref = isExternalCheckout && checkout.url ? checkout.url : '#oferta';

  useEffect(() => {
    // Verificar suporte a fullscreen no cliente
    if (typeof document !== 'undefined') {
      const el = document.documentElement;
      setIsFullscreenSupported(
        Boolean(
          document.fullscreenEnabled ||
          'webkitFullscreenEnabled' in document ||
          'mozFullScreenEnabled' in document ||
          'msFullscreenEnabled' in document ||
          (el && 'webkitRequestFullscreen' in el)
        )
      );
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;

    controller.current = mountVslController({
      video,
      viewportTarget: frameRef.current ?? video,
      onState: setState,
    });

    const handleTimeUpdate = () => {
      const t = video.currentTime;
      setCurrentTime(t);
      // Revelar o botão pulse ao minuto 1:13 (73 segundos)
      if (t >= 73) {
        setShowCta(true);
      }
      if (video.buffered.length > 0 && video.duration > 0) {
        const end = video.buffered.end(video.buffered.length - 1);
        setBufferedPercent(Math.min(100, Math.round((end / video.duration) * 100)));
      }
    };

    const handleDurationChange = () => {
      if (Number.isFinite(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);
    const handleEnded = () => {
      setIsPlaying(false);
      setShowCta(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadedmetadata', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('ended', handleEnded);

    return () => {
      controller.current?.destroy();
      controller.current = null;
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadedmetadata', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  // Primeiro clique para ouvir desde o início com som
  const handleFirstPlayWithSound = () => {
    if (controller.current) {
      controller.current.restartWithSound();
    }
  };

  // Pausa normal ou retoma a partir do tempo atual
  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (state.mode === 'preview') {
      handleFirstPlayWithSound();
      return;
    }

    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const handleToggleFullscreen = () => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame && !video) return;

    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else if (frame?.requestFullscreen) {
      void frame.requestFullscreen().catch(() => {});
    } else if ((video as unknown as { webkitEnterFullscreen?: () => void })?.webkitEnterFullscreen) {
      (video as unknown as { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="keds-vsl" id={id} aria-labelledby={title ? `${uid}-title` : undefined}>
      {Boolean(title) && (
        <div className="keds-vsl__header">
          <h2 id={`${uid}-title`}>{title}</h2>
        </div>
      )}

      <div
        className={`keds-vsl__frame ${state.mode === 'preview' ? 'keds-vsl__frame--preview' : ''}`}
        ref={frameRef}
        onClick={state.mode === 'preview' ? handleFirstPlayWithSound : undefined}
      >
        {src ? (
          <>
            <video
              key={src}
              ref={videoRef}
              src={src}
              poster={poster ?? undefined}
              playsInline
              autoPlay
              muted
              loop={state.mode === 'preview'}
              preload="auto"
              aria-label="Apresentação do Kit Emprego dos Sonhos"
              aria-describedby={`${uid}-status`}
              onClick={state.mode === 'full' ? handleTogglePlay : undefined}
            >
              {captionsSrc && (
                <track kind="captions" src={captionsSrc} srcLang="pt-PT" label="Português" default />
              )}
              O teu navegador não suporta este vídeo.
            </video>

            {/* Duração no canto superior quando disponível */}
            {duration > 0 && (
              <div className="keds-vsl__duration-pill-wrapper">
                <span className="keds-vsl__duration-pill">{formatTime(duration)}</span>
              </div>
            )}

            {/* Overlay limpo em Modo Preview (Autoplay mudo + Toca para ouvir com som) */}
            {state.mode === 'preview' && (
              <div className="keds-vsl__preview-overlay">
                <button
                  type="button"
                  className="keds-vsl__sound-alert-banner"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFirstPlayWithSound();
                  }}
                  aria-label="Tocar para ouvir com som desde o início"
                >
                  <Volume2 size={18} aria-hidden="true" />
                  <span>Sem som · Toca para ouvir</span>
                </button>
              </div>
            )}

            {/* Barra de Controlo Real quando em reprodução ativa (modo completo com som) */}
            {state.mode === 'full' && (
              <div className="keds-vsl__control-bar" onClick={(e) => e.stopPropagation()}>
                <div
                  className="keds-vsl__progress-container"
                  onClick={handleSeek}
                  onKeyDown={(e) => {
                    const video = videoRef.current;
                    if (!video || !duration) return;
                    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      video.currentTime = Math.min(duration, video.currentTime + 5);
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      video.currentTime = Math.max(0, video.currentTime - 5);
                    }
                  }}
                  tabIndex={0}
                  role="slider"
                  aria-label="Controlo de avanço do vídeo"
                  aria-valuenow={Math.round(currentTime)}
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration)}
                  aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
                >
                  <div
                    className="keds-vsl__progress-buffered"
                    style={{ width: `${bufferedPercent}%` }}
                  />
                  <div
                    className="keds-vsl__progress-played"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="keds-vsl__controls-row">
                  <div className="keds-vsl__controls-left">
                    <button
                      type="button"
                      className="keds-vsl__btn-ctrl"
                      onClick={handleTogglePlay}
                      aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                      {isPlaying ? (
                        <Pause size={15} fill="currentColor" aria-hidden="true" />
                      ) : (
                        <Play size={15} fill="currentColor" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="keds-vsl__btn-ctrl"
                      onClick={handleToggleMute}
                      aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
                    >
                      {isMuted ? (
                        <VolumeX size={15} aria-hidden="true" />
                      ) : (
                        <Volume2 size={15} aria-hidden="true" />
                      )}
                    </button>
                    <span className="keds-vsl__time-display">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="keds-vsl__controls-right">
                    {isFullscreenSupported && (
                      <button
                        type="button"
                        className="keds-vsl__btn-ctrl"
                        onClick={handleToggleFullscreen}
                        aria-label="Ecrã inteiro"
                      >
                        <Maximize2 size={14} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Estado Honesto e Funcional Sem Vídeo Configurado: Poster 9:16 de Preparação */
          <div className="keds-vsl__poster-screen keds-vsl__poster-screen--preparation">
            <div className="keds-vsl__poster-top">
              <span className="keds-vsl__prep-pill">
                <span>Apresentação em preparação</span>
              </span>
            </div>

            <div className="keds-vsl__poster-center">
              <h3 className="keds-vsl__poster-title">
                Prepara a tua próxima candidatura.
              </h3>
              <p className="keds-vsl__poster-subtitle">
                Vê como usar os recursos do kit.
              </p>

              <a
                href="#oferta"
                className="keds-vsl__prep-cta"
                aria-label="Consultar os recursos do kit na secção da oferta"
              >
                <span>Consultar recursos da oferta</span>
                <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="keds-vsl__prep-footer">
              <span>Oferta completa disponível abaixo</span>
            </div>
          </div>
        )}
      </div>

      {/* Botão de conversão com pulsação aos 1:13 do vídeo */}
      {showCta && (
        <div className="keds-vsl__cta-wrapper" id="vsl-cta">
          <a
            href={checkoutHref}
            target={isExternalCheckout ? '_blank' : undefined}
            rel={isExternalCheckout ? 'noopener noreferrer' : undefined}
            className="keds-vsl__cta-button"
            aria-label="Eu quero aderir ao Kit Emprego dos Sonhos"
          >
            <span>EU QUERO ADERIR!</span>
            <ArrowRight size={20} aria-hidden="true" />
          </a>
          <p className="keds-vsl__cta-caption">
            Acesso imediato · Pagamento único de 14,99 € · Entrega por email
          </p>
        </div>
      )}

      {src && (
        <p className="keds-vsl__status" id={`${uid}-status`} role="status" aria-live="polite">
          {state.message ||
            (state.mode === 'preview' ? 'Ao tocar, o vídeo recomeça do princípio com som.' : '')}
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
