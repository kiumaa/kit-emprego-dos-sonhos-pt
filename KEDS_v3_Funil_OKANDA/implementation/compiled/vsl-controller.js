export function mountVslController(options) {
    const { video, onState } = options;
    let disposed = false;
    let inView = false;
    let previewStoppedByUser = false;
    let pendingSeek = false;
    let attempt = 0;
    let state = { mode: 'preview', phase: 'idle', message: '' };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection;
    const listeners = [];
    const update = (patch) => {
        if (disposed)
            return;
        state = { ...state, ...patch };
        onState({ ...state });
    };
    const listen = (name, listener) => {
        video.addEventListener(name, listener);
        listeners.push([name, listener]);
    };
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.controls = false;
    video.loop = true;
    video.preload = 'metadata';
    const previewAllowed = () => !motion.matches && !connection?.saveData;
    const tryPreview = () => {
        if (disposed || state.mode !== 'preview' || previewStoppedByUser ||
            !inView || document.hidden || !previewAllowed() || state.phase === 'error')
            return;
        const token = ++attempt;
        video.muted = true;
        video.loop = true;
        void video.play().catch((error) => {
            if (disposed || token !== attempt || state.mode !== 'preview')
                return;
            if (error instanceof DOMException && error.name === 'AbortError')
                return;
            update({ phase: 'ready', message: 'Carrega no botão para iniciar o vídeo.' });
        });
    };
    const pauseForContext = () => {
        ++attempt;
        video.pause();
    };
    listen('playing', () => update({ phase: state.mode === 'preview' ? 'preview' : 'playing', message: '' }));
    listen('pause', () => {
        if (state.phase !== 'error' && state.phase !== 'ended')
            update({ phase: 'paused' });
    });
    listen('ended', () => update({ phase: 'ended', message: '' }));
    listen('error', () => update({ phase: 'error', message: 'Não foi possível carregar o vídeo. Podes tentar novamente ou consultar a oferta abaixo.' }));
    listen('loadedmetadata', () => {
        if (pendingSeek) {
            try {
                video.currentTime = 0;
                pendingSeek = false;
            }
            catch { /* O play manual continua disponível. */ }
        }
    });
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
        const entry = entries[0];
        inView = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= 0.5);
        if (inView)
            tryPreview();
        else
            pauseForContext();
    }, { threshold: [0, 0.5] }) : null;
    observer?.observe(options.viewportTarget ?? video);
    const onVisibility = () => {
        if (document.hidden)
            pauseForContext();
        else
            tryPreview(); // Nunca retoma som automaticamente.
    };
    const onMotionChange = () => {
        if (state.mode === 'preview') {
            if (motion.matches)
                pauseForContext();
            else
                tryPreview();
        }
    };
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotionChange);
    update({ phase: previewAllowed() && observer ? 'idle' : 'ready' });
    return {
        restartWithSound() {
            if (disposed)
                return;
            const token = ++attempt;
            // Não inserir await, setTimeout ou pedido de rede antes de play(): preserva o gesto do utilizador.
            video.pause();
            update({ mode: 'full', phase: 'starting', message: '' });
            video.loop = false;
            video.controls = true;
            video.defaultMuted = false;
            video.muted = false;
            if (video.error)
                video.load();
            try {
                video.currentTime = 0;
                pendingSeek = false;
            }
            catch {
                pendingSeek = true;
            }
            void video.play().catch((error) => {
                if (disposed || token !== attempt)
                    return;
                if (error instanceof DOMException && error.name === 'AbortError')
                    return;
                update({ phase: 'ready', message: 'O navegador não iniciou o vídeo. Carrega novamente para reproduzir com som.' });
            });
        },
        pausePreview() {
            if (state.mode !== 'preview')
                return;
            previewStoppedByUser = true;
            pauseForContext();
            update({ phase: 'paused', message: 'Pré-visualização em pausa.' });
        },
        destroy() {
            if (disposed)
                return;
            disposed = true;
            ++attempt;
            observer?.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            motion.removeEventListener('change', onMotionChange);
            listeners.forEach(([name, listener]) => video.removeEventListener(name, listener));
            video.pause();
        },
    };
}
