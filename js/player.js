import { readCookie } from "./cookies.js";

const token = readCookie("SpotifyBearer");
if (!token) {
  location.href = "/index.html";
}

export let player;
let progressInterval;
let currentQueue = [];
let currentTrackIndex = 0;

// Function to fetch album tracks
async function fetchAlbumTracks(albumId, token) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    currentQueue = data.items.map(track => track.uri);
    console.log('Album tracks loaded:', currentQueue);
  } catch (err) {
    console.error("Error fetching album tracks:", err);
  }
}

// Function to initialize the Spotify player
export async function initSpotifyPlayer(albumId, token) {
    // Fetch album tracks first
    await fetchAlbumTracks(albumId, token);
  
    // Initialize the player
    player = new Spotify.Player({
      name: 'Web Playback SDK Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5,
      robustnessLevel: 'HW_SECURE_ALL' // Specify robustness level here
    });
  
    // Add listeners for various events (errors, playback state changes, etc.)
    player.addListener('initialization_error', ({ message }) => console.error(message));
    player.addListener('authentication_error', ({ message }) => console.error(message));
    player.addListener('account_error', ({ message }) => console.error(message));
    player.addListener('playback_error', ({ message }) => console.error(message));
  
    player.addListener('player_state_changed', state => {
      if (state) {
        updatePlayerUI(state);
      }
    });
  
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      transferPlaybackHere(device_id); // A function you can define to transfer playback
    });
  
    player.connect();
  
    // Add event listeners for progress bar interaction
    const progressBar = document.getElementById("progress");
  
    // Handle click event on the progress bar
    progressBar.addEventListener("click", (event) => {
      const rect = progressBar.getBoundingClientRect(); // Get the position of the progress bar
      const clickX = event.clientX - rect.left; // Get the x coordinate of the click within the bar
      const width = rect.width; // Get the width of the progress bar
      const percentage = clickX / width; // Calculate the percentage of the click position
  
      player.getCurrentState().then(state => {
        const newTime = percentage * state.duration; // Get the duration from current state
        player.seek(newTime).then(() => {
          console.log(`Seeked to ${formatTime(newTime / 1000)}`);
        });
      });
    });
  
    // Handle input event for dragging the progress bar
    progressBar.addEventListener("input", () => {
      const newTime = progressBar.value * 1000; // Convert seconds to milliseconds
      player.seek(newTime).then(() => {
        console.log(`Seeked to ${formatTime(newTime / 1000)}`);
      });
    });
  
    // Add volume control logic
    const volumeControl = document.getElementById("volume");
  
    // Set initial volume based on the slider
    player.setVolume(volumeControl.value / 100).catch(error => {
      console.error('Error setting volume:', error);
    });
  
    // Event listener for volume control
    volumeControl.addEventListener("input", () => {
      const volume = volumeControl.value / 100; // Convert to a value between 0 and 1
      player.setVolume(volume).catch(error => {
        console.error('Error setting volume:', error);
      });
    });
  
    // Add event listeners for rewind and skip buttons
    document.getElementById("rewind-btn").addEventListener("click", rewindTrack);
    document.getElementById("skip-btn").addEventListener("click", skipTrack);
  }
  
  // Function to rewind the current track by 15 seconds
    function rewindTrack() {
    player.getCurrentState().then(state => {
        if (state) {
        const newPosition = Math.max(0, state.position - 15000); // 15 seconds in milliseconds
        player.seek(newPosition).then(() => {
            console.log(`Rewound to ${formatTime(newPosition / 1000)}`);
        });
        }
    });
    }

    // Function to skip the current track by 15 seconds
    function skipTrack() {
    player.getCurrentState().then(state => {
        if (state) {
        const newPosition = Math.min(state.duration, state.position + 15000); // 15 seconds in milliseconds
        player.seek(newPosition).then(() => {
            console.log(`Skipped to ${formatTime(newPosition / 1000)}`);
        });
        }
    });
}

// Function to update the UI with the current track details
function updatePlayerUI(state) {
  const currentTrack = state.track_window.current_track;
  currentTrackIndex = currentQueue.indexOf(currentTrack.uri);

  document.getElementById("track-name").innerText = currentTrack.name;
  document.getElementById("artist-name").innerText = currentTrack.artists[0].name;
  document.getElementById("album-cover").src = currentTrack.album.images[0].url;

  const currentPosition = state.position / 1000; // Convert to seconds
  const duration = state.duration / 1000; // Convert to seconds
  document.getElementById("progress").value = currentPosition;
  document.getElementById("progress").max = duration;

  document.getElementById("current-time").innerText = formatTime(currentPosition);
  document.getElementById("total-time").innerText = formatTime(duration);

  // Update play/pause button
  const playBtn = document.getElementById("play-btn");
  const pauseBtn = document.getElementById("pause-btn");
  if (state.paused) {
    playBtn.style.display = "block";
    pauseBtn.style.display = "none";
    clearInterval(progressInterval); // Stop the progress updates
  } else {
    playBtn.style.display = "none";
    pauseBtn.style.display = "block";
    startProgressInterval(); // Start updating the progress bar
  }
}

// Function to handle previous/next track controls
export function playCurrentTrack() {
  const trackUri = currentQueue[currentTrackIndex];
  if (trackUri) {
    player._options.getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }).then(() => {
        console.log(`Playing track ${trackUri}`);
      }).catch(err => console.error("Error playing track:", err));
    });
  }
}

// Previous and Next buttons
export function nextTrack() {
  if (currentQueue.length > 0) {
    currentTrackIndex = (currentTrackIndex + 1) % currentQueue.length;
    playCurrentTrack();
  }
}

export function previousTrack() {
  if (currentQueue.length > 0) {
    currentTrackIndex = (currentTrackIndex - 1 + currentQueue.length) % currentQueue.length;
    playCurrentTrack();
  }
}

// Function to format time in mm:ss format
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to start updating the progress bar
function startProgressInterval() {
  progressInterval = setInterval(() => {
    player.getCurrentState().then(state => {
      if (state) {
        const currentPosition = state.position / 1000; // Convert to seconds
        const duration = state.duration / 1000; // Convert to seconds
        document.getElementById("progress").value = currentPosition;
        document.getElementById("current-time").innerText = formatTime(currentPosition);
        document.getElementById("total-time").innerText = formatTime(duration);
      }
    });
  }, 1000); // Update every second
}

// Transfer playback to the Web SDK device
function transferPlaybackHere(device_id) {
  fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "device_ids": [device_id],
      "play": true // Set to true to start playback on transfer
    })
  });
}
