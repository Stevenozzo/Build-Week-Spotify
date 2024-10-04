<<<<<<< HEAD
let isPlaying = false;
let currentTrackUri = null;

// Play button event
document.getElementById("play-btn").addEventListener("click", () => {
  if (player && currentTrackUri) {
    player.resume().then(() => {
      isPlaying = true;
      updatePlayState();
    });
  }
});

// Pause button event
document.getElementById("pause-btn").addEventListener("click", () => {
  if (player) {
    player.pause().then(() => {
      isPlaying = false;
      updatePlayState();
    });
  }
});

// Previous button event
document.getElementById("prev-btn").addEventListener("click", () => {
  if (player) {
    player.previousTrack();
  }
});

// Next button event
document.getElementById("next-btn").addEventListener("click", () => {
  if (player) {
    player.nextTrack();
  }
});

// Volume control
document.getElementById("volume").addEventListener("input", function () {
  const volume = this.value / 100;
  if (player) {
    player.setVolume(volume);
  }
});

// Progress bar control
document.getElementById("progress").addEventListener("input", function () {
  const newPosition = this.value;
  if (player) {
    player.seek(newPosition * 1000); // Convert to milliseconds
  }
});

// Listen for playback status updates and update UI
player.addListener('player_state_changed', state => {
  if (!state) return;

  const currentTrack = state.track_window.current_track;
  document.getElementById("track-name").innerText = currentTrack.name;
  document.getElementById("artist-name").innerText = currentTrack.artists[0].name;
  document.getElementById("album-cover").src = currentTrack.album.images[0].url;

  const currentPosition = state.position / 1000; // Convert to seconds
  const duration = state.duration / 1000; // Convert to seconds
  document.getElementById("progress").value = currentPosition;
  document.getElementById("progress").max = duration;

  document.getElementById("current-time").innerText = formatTime(currentPosition);
  document.getElementById("total-time").innerText = formatTime(duration);

  isPlaying = !state.paused;
  updatePlayState();
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

function updatePlayState() {
  document.getElementById("play-btn").style.display = isPlaying ? "none" : "block";
  document.getElementById("pause-btn").style.display = isPlaying ? "block" : "none";
}
=======
import { transferPlayback, playSong, pauseSong } from "./modules/playerFn.js";
const token = localStorage.getItem('access_token')

if (!token) location.href = '/login.html'

window.onSpotifyWebPlaybackSDKReady = () => {
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5,
  });

  // Gestione degli errori
  player.addListener('initialization_error', ({ message }) => {
    console.error('Errore di inizializzazione:', message);
  });
  player.addListener('authentication_error', ({ message }) => {
    console.error('Errore di autenticazione:', message);
  });
  player.addListener('account_error', ({ message }) => {
    console.error('Errore dell\'account:', message);
  });
  player.addListener('playback_error', ({ message }) => {
    console.error('Errore di riproduzione:', message);
  });

  // Stato del player
  player.addListener('player_state_changed', state => {
    console.log('Stato del player cambiato:', state);
  });

  // Pronto
  player.addListener('ready', ({ device_id }) => {
    console.log('Il dispositivo è pronto con ID', device_id);

    // Trasferisco la riproduzione su questo dispositivo appena creato
    transferPlayback(device_id, token);
  });

  player.addListener('not_ready', ({ device_id }) => {
    console.log('Il dispositivo non è pronto:', device_id);
  });

  player.connect();
};



const playButton = document.querySelectorAll('.play-button');
playButton.forEach(button => {
  button.addEventListener('click', function () {
    const trackUri = this.getAttribute('data-track')
    playSong(trackUri);
  })
})

const pauseButton = document.querySelectorAll('.pause-button');
pauseButton.forEach(button => {
  button.addEventListener('click', function () {
    pauseSong();
  })
})
>>>>>>> origin/Andrea
