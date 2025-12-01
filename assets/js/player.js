// Floating Music Player
document.addEventListener('DOMContentLoaded', () => {
  // Données des pistes
  const tracks = [
    {
      title: 'Warm Up - Pop/Rock',
      artist: 'Zone départ - 0-2 km',
      duration: 225, // 3:45 en secondes
    },
    {
      title: 'Electro Energy',
      artist: 'Zone montée - 2-5 km',
      duration: 260, // 4:20
    },
    {
      title: 'Hip-Hop Motivation',
      artist: 'Zone effort - 5-8 km',
      duration: 235, // 3:55
    },
    {
      title: 'Rock Finale',
      artist: 'Zone finale - 8-10 km',
      duration: 250, // 4:10
    }
  ];

  // Variables
  let currentTrackIndex = 0;
  let isPlaying = false;
  let currentTime = 0;
  let progressInterval = null;

  // Éléments DOM
  const floatingPlayer = document.getElementById('floatingPlayer');
  const togglePlayerBtn = document.getElementById('togglePlayer');
  const closePlayerBtn = document.getElementById('closePlayer');
  const playerContent = document.getElementById('playerContent');
  const playBtn = document.querySelector('.play-btn-mini');
  const playIcon = document.querySelector('.play-icon-mini');
  const pauseIcon = document.querySelector('.pause-icon-mini');
  const prevBtn = document.querySelector('.prev-btn-mini');
  const nextBtn = document.querySelector('.next-btn-mini');
  const trackTitle = document.querySelector('.track-title-mini');
  const trackArtist = document.querySelector('.track-artist-mini');
  const currentTimeEl = document.querySelector('.current-time-mini');
  const totalTimeEl = document.querySelector('.total-time-mini');
  const progressBar = document.querySelector('.progress-bar-mini');
  const progressFill = document.querySelector('.progress-fill-mini');
  const playlistItems = document.querySelectorAll('.playlist-item-mini');

  // Toggle player (réduire/agrandir)
  togglePlayerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    floatingPlayer.classList.toggle('minimized');
    const svg = togglePlayerBtn.querySelector('svg path');
    if (floatingPlayer.classList.contains('minimized')) {
      svg.setAttribute('d', 'M7 14l5-5 5 5z'); // Flèche vers le haut
    } else {
      svg.setAttribute('d', 'M7 10l5 5 5-5z'); // Flèche vers le bas
    }
  });

  // Fermer le player
  closePlayerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    floatingPlayer.classList.add('closed');
    if (isPlaying) {
      pause();
    }
  });

  // Cliquer sur le header pour toggle
  const playerHeader = document.querySelector('.player-header');
  playerHeader.addEventListener('click', (e) => {
    if (e.target === playerHeader || e.target === document.querySelector('.player-label')) {
      togglePlayerBtn.click();
    }
  });

  // Initialiser
  function init() {
    loadTrack(currentTrackIndex);
    updateTotalTime();
  }

  // Charger une piste
  function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index];

    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    currentTime = 0;
    updateCurrentTime();
    updateProgressBar();
    updatePlaylistActive();
  }

  // Format du temps (secondes -> mm:ss)
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Mise à jour du temps total
  function updateTotalTime() {
    const duration = tracks[currentTrackIndex].duration;
    totalTimeEl.textContent = formatTime(duration);
  }

  // Mise à jour du temps actuel
  function updateCurrentTime() {
    currentTimeEl.textContent = formatTime(currentTime);
  }

  // Mise à jour de la barre de progression
  function updateProgressBar() {
    const duration = tracks[currentTrackIndex].duration;
    const progress = (currentTime / duration) * 100;
    progressFill.style.width = `${progress}%`;
  }

  // Mise à jour de la playlist active
  function updatePlaylistActive() {
    playlistItems.forEach((item, index) => {
      if (index === currentTrackIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Lecture/Pause
  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  // Lecture
  function play() {
    isPlaying = true;
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');

    // Simuler la progression
    progressInterval = setInterval(() => {
      currentTime++;
      updateCurrentTime();
      updateProgressBar();

      // Passer à la piste suivante quand terminée
      if (currentTime >= tracks[currentTrackIndex].duration) {
        nextTrack();
      }
    }, 1000);
  }

  // Pause
  function pause() {
    isPlaying = false;
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');

    if (progressInterval) {
      clearInterval(progressInterval);
    }
  }

  // Piste précédente
  function prevTrack() {
    if (currentTime > 3) {
      currentTime = 0;
      updateCurrentTime();
      updateProgressBar();
    } else {
      const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      loadTrack(newIndex);
      updateTotalTime();

      if (isPlaying) {
        pause();
        play();
      }
    }
  }

  // Piste suivante
  function nextTrack() {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(newIndex);
    updateTotalTime();

    if (isPlaying) {
      pause();
      play();
    }
  }

  // Clic sur la barre de progression
  function seekTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const duration = tracks[currentTrackIndex].duration;

    currentTime = duration * percentage;
    updateCurrentTime();
    updateProgressBar();
  }

  // Événements
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (progressBar) progressBar.addEventListener('click', seekTo);

  // Clic sur un élément de la playlist
  playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      loadTrack(index);
      updateTotalTime();

      if (isPlaying) {
        pause();
      }
      play();
    });
  });

  // Raccourcis clavier (optionnel)
  document.addEventListener('keydown', (e) => {
    if (floatingPlayer.classList.contains('closed')) return;

    switch(e.code) {
      case 'Space':
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          togglePlay();
        }
        break;
    }
  });

  // Initialiser
  init();

  // Afficher le player après un délai (optionnel)
  setTimeout(() => {
    floatingPlayer.style.opacity = '1';
  }, 500);
});

/*
  NOTES POUR INTÉGRATION AUDIO RÉELLE:

  1. Créer un élément Audio:
     const audio = new Audio();

  2. Dans loadTrack():
     audio.src = tracks[index].audio;
     audio.load();

  3. Dans play():
     audio.play();

  4. Dans pause():
     audio.pause();

  5. Écouter les événements:
     audio.addEventListener('timeupdate', () => {
       currentTime = audio.currentTime;
       updateCurrentTime();
       updateProgressBar();
     });

     audio.addEventListener('ended', nextTrack);
     audio.addEventListener('loadedmetadata', updateTotalTime);
*/
