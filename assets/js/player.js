// Music Player fonctionnel
document.addEventListener('DOMContentLoaded', () => {
  // Données des pistes (simulées - à remplacer par de vraies URLs audio)
  const tracks = [
    {
      title: 'Warm Up - Pop/Rock',
      artist: 'Zone de départ - 0-2 km',
      duration: 225, // 3:45 en secondes
      // Vous pourrez ajouter l'URL audio réelle ici
      // audio: 'assets/audio/track1.mp3'
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
  const playBtn = document.querySelector('.play-btn');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  const progressBar = document.querySelector('.progress-bar');
  const progressFill = document.querySelector('.progress-fill');
  const volumeSlider = document.querySelector('.volume-slider');
  const playlistItems = document.querySelectorAll('.playlist-item');

  // Initialiser le player
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

    // Simuler la progression (remplacer par audio.play() avec un vrai fichier audio)
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
      // Si on est à plus de 3 secondes, revenir au début
      currentTime = 0;
      updateCurrentTime();
      updateProgressBar();
    } else {
      // Sinon, piste précédente
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
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prevTrack);
  nextBtn.addEventListener('click', nextTrack);
  progressBar.addEventListener('click', seekTo);

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

  // Volume (pour démo visuelle - à connecter avec un vrai audio)
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    // Si vous utilisez un élément audio HTML5:
    // audio.volume = volume;
    console.log('Volume:', volume);
  });

  // Raccourcis clavier
  document.addEventListener('keydown', (e) => {
    // Seulement si le player est visible
    const musicSection = document.querySelector('.music-section');
    if (!musicSection) return;

    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevTrack();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextTrack();
        break;
    }
  });

  // Initialiser
  init();
});

/*
  NOTE POUR INTÉGRER DE VRAIS FICHIERS AUDIO:

  1. Ajouter un élément audio HTML5:
     const audio = new Audio();

  2. Dans loadTrack(), charger le fichier:
     audio.src = tracks[index].audio;

  3. Dans play():
     audio.play();

  4. Dans pause():
     audio.pause();

  5. Écouter les événements audio:
     audio.addEventListener('timeupdate', () => {
       currentTime = audio.currentTime;
       updateCurrentTime();
       updateProgressBar();
     });

     audio.addEventListener('ended', () => {
       nextTrack();
     });

  6. Pour le volume:
     audio.volume = volumeSlider.value / 100;
*/
