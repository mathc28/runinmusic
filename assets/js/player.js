// Floating Music Player
document.addEventListener('DOMContentLoaded', () => {
  // Données des pistes
  const tracks = [
    {
      title: 'Den Den Mushi',
      artist: 'OP - 0-2 km',
      audio: "/assets/audio/Den-Den-Mushi.mp3" // Ajoutez votre fichier audio ici
    },
    {
      title: 'Electro Energy',
      artist: 'Zone montée - 2-5 km',
      audio: 'assets/audio/electro.mp3'
    },
    {
      title: 'Hip-Hop Motivation',
      artist: 'Zone effort - 5-8 km',
      audio: 'assets/audio/hiphop.mp3'
    },
    {
      title: 'Rock Finale',
      artist: 'Zone finale - 8-10 km',
      audio: 'assets/audio/rock.mp3'
    }
  ];

  // Créer l'élément audio
  const audio = new Audio();
  audio.volume = 0.7; // Volume par défaut à 70%

  // Variables
  let currentTrackIndex = 0;
  let isPlaying = false;

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
    
    // Démarrer minimisé
    floatingPlayer.classList.add('minimized');
    const svg = togglePlayerBtn.querySelector('svg path');
    svg.setAttribute('d', 'M7 14l5-5 5 5z'); // Flèche vers le haut
  }

  // Charger une piste
  function loadTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index];

    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;

    // Charger l'audio
    audio.src = track.audio;
    audio.load();

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
    if (audio.duration && !isNaN(audio.duration)) {
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  }

  // Mise à jour du temps actuel
  function updateCurrentTime() {
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }

  // Mise à jour de la barre de progression
  function updateProgressBar() {
    if (audio.duration && !isNaN(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${progress}%`;
    }
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
    audio.play().then(() => {
      isPlaying = true;
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
    }).catch(err => {
      console.error('Erreur de lecture:', err);
    });
  }

  // Pause
  function pause() {
    audio.pause();
    isPlaying = false;
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
  }

  // Piste précédente
  function prevTrack() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      loadTrack(newIndex);
      if (isPlaying) {
        play();
      }
    }
  }

  // Piste suivante
  function nextTrack() {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(newIndex);
    if (isPlaying) {
      play();
    }
  }

  // Clic sur la barre de progression
  function seekTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;

    if (audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = audio.duration * percentage;
    }
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
      play();
    });
  });

  // Raccourcis clavier
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

  // Événements audio
  audio.addEventListener('timeupdate', () => {
    updateCurrentTime();
    updateProgressBar();
  });

  audio.addEventListener('ended', () => {
    nextTrack();
  });

  audio.addEventListener('loadedmetadata', () => {
    updateTotalTime();
  });

  audio.addEventListener('error', (e) => {
    console.error('Erreur de chargement audio:', e);
    // Afficher un message d'erreur à l'utilisateur
    trackTitle.textContent = 'Erreur de chargement';
    trackArtist.textContent = 'Fichier audio introuvable';
  });

  // Gestion du volume
  const volumeBtn = document.querySelector('.volume-btn-mini');
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      if (audio.volume > 0) {
        audio.volume = 0;
        volumeBtn.style.opacity = '0.5';
      } else {
        audio.volume = 0.7;
        volumeBtn.style.opacity = '1';
      }
    });
  }

  // Initialiser
  init();

  // Afficher le player après un délai
  setTimeout(() => {
    floatingPlayer.style.opacity = '1';
  }, 500);
});
