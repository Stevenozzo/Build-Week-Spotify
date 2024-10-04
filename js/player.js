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
