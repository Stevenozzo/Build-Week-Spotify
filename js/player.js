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