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
export declare function mountVslController(options: VslControllerOptions): VslController;
