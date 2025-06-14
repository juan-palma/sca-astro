/* =======================================================================
   Video Module (ES6)
   Adaptado para Vite - Juan Palma (2025)
======================================================================= */

// Función para extraer ID de YouTube
function extraerYouTubeID(url) {
    const re = /(?:youtube\.com\/.*v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const m = url.match(re);
    return m ? m[1] : null;
}

// Función principal para inicializar videos
export function initVideos() {
    document.querySelectorAll('.video-wrapper').forEach(w => {
        const type = w.dataset.videoType;
        const src = w.dataset.videoSrc;

        switch (type) {
            case 'local':
                createLocalVideo(w, src);
                break;
                
            case 'youtube':
                createYouTubeVideo(w, src);
                break;
                
            case 'external':
                createExternalVideo(w, src);
                break;
                
            default:
                console.warn('Tipo de vídeo desconocido:', type);
        }
    });
}

// Creador de videos locales
function createLocalVideo(wrapper, src) {
    const vid = document.createElement('video');
    vid.src = src;
    vid.controls = true;
    vid.autoplay = true;
    vid.loop = true;
    vid.muted = true;
    vid.setAttribute('playsinline', '');
    vid.setAttribute('preload', 'auto');
    
    // Opcional: añadir poster si es necesario
    // vid.setAttribute('poster', '@/assets/img/placeholder.jpg');
    
    wrapper.appendChild(vid);
}

// Creador de videos de YouTube
function createYouTubeVideo(wrapper, src) {
    const id = extraerYouTubeID(src);
    if (!id) return console.warn('YouTube ID no válido:', src);

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}`;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.allowFullscreen = true;
    iframe.setAttribute('loading', 'lazy');
    
    wrapper.appendChild(iframe);
}

// Creador de videos externos (Vimeo, etc.)
function createExternalVideo(wrapper, src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    
    wrapper.appendChild(iframe);
}

// Exportación alternativa como módulo completo
export default {
    initVideos,
    extraerYouTubeID
};

/* =======================================================================
   Ejemplos de uso en HTML:

   <!-- Vídeo local -->
   <div class="video-wrapper"
        data-video-type="local"
        data-video-src="@/assets/videos/miVideo.mp4">
   </div>

   <!-- Vídeo externo (Vimeo, etc.) -->
   <div class="video-wrapper"
        data-video-type="external"
        data-video-src="https://player.vimeo.com/video/123456789">
   </div>

   <!-- YouTube -->
   <div class="video-wrapper"
        data-video-type="youtube"
        data-video-src="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
   </div>
======================================================================= */