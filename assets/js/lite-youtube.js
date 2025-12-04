// Lite YouTube Embed - Charge les vidéos uniquement au clic
// Économise ~670 KiB par vidéo

document.addEventListener('DOMContentLoaded', () => {
  const liteYoutubes = document.querySelectorAll('.lite-youtube');

  liteYoutubes.forEach(liteYoutube => {
    const videoId = liteYoutube.dataset.id;
    const videoTitle = liteYoutube.dataset.title || 'Vidéo YouTube';

    // Créer l'image de prévisualisation
    const thumbnail = document.createElement('img');
    thumbnail.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    thumbnail.alt = videoTitle;
    thumbnail.loading = 'lazy';
    liteYoutube.appendChild(thumbnail);

    // Créer le bouton play
    const playButton = document.createElement('button');
    playButton.className = 'lite-youtube-play';
    playButton.setAttribute('aria-label', `Lire la vidéo : ${videoTitle}`);
    playButton.innerHTML = `<svg viewBox="0 0 68 48" width="68" height="48"><path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>`;

    liteYoutube.appendChild(playButton);

    // Charger la vraie iframe au clic
    liteYoutube.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
      iframe.title = videoTitle;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      // Remplacer le contenu par l'iframe
      liteYoutube.innerHTML = '';
      liteYoutube.appendChild(iframe);
    });
  });
});
