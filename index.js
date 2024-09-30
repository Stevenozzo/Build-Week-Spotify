const trackArt = document.getElementById("album-cover");
const trackName = document.getElementById("song-title");
const trackArtist = document.getElementById("song-artist");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("slider_container");

const trackList = [
  {
    name: "Million Cash",
    artist: "Maya",
    image: "./artworks-zHF24h1jRpWWaJ1I-vTqMcA-t500x500.jpg",
    path: "./xg-xg-tape-4-million-cash-maya.m4a",
  },
  {
    name: "XG Tape 2 - GALZ",
    artist: "XG",
    image: "./artworks-IpfJECHJSdO1X0Br-7z51Gg-t500x500.jpg",
    path: "./XG_TAPE_2_GALZ_XYPHER_COCONA_MAYA_HARVEY_JURINMP3_320K.mp3",
  },
  {
    name: "Woke Up",
    artist: "XG",
    image: "./0x1900-000000-80-0-0.jpg",
    path: "./WOKE UP.mp3",
  },
];

let isPlaying = false;

// Play song
const playSong = () => {
  isPlaying = true;
  audio.play();
  playBtn.style.display = "none";
  pauseBtn.style.display = "inline";
};

// Pause song
const pauseSong = () => {
  isPlaying = false;
  audio.pause();
  playBtn.style.display = "inline";
  pauseBtn.style.display = "none";
};

// Update progress bar
const updateProgress = () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
};

// Format time (MM:SS)
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
};

// Event Listeners
playBtn.addEventListener("click", playSong);
pauseBtn.addEventListener("click", pauseSong);
audio.addEventListener("timeupdate", updateProgress);

// Optional: Handle previous/next buttons
prevBtn.addEventListener("click", () => {
  // Implement previous song functionality
});

nextBtn.addEventListener("click", () => {
  // Implement next song functionality
});
