/*const trackArt = document.getElementById("album-cover");
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
});*/

// const apiUrlBase = "https://accounts.spotify.com/api/token";
// const clientSecret = "5514452ad2a34ace9f586ac267d2c688";
// const clientId = "7b034cec707f4f8d90a0afdb115bd809";

// // Funzione per ottenere il token
// const getToken = async () => {
//   try {
//     const response = await fetch(apiUrlBase, {
//       method: "POST",
//       headers: {
//         Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
//       },
//       body: new URLSearchParams({
//         grant_type: "client_credentials",
//       }),
//     });

//     const data = await response.json();
//     console.log("Access Token:", data.access_token);
//     return data.access_token; // Ritorna il token
//   } catch (error) {
//     console.error("Errore nell'ottenere il token:", error);
//   }
// };

// // Funzione per ottenere i dati dell'artista
// const getArtistData = async (token) => {
//   const vendittiId = "2uYWxilOVlUdk4oV9DvwqK";
//   const apiUrlArtist = `https://api.spotify.com/v1/artists/${vendittiId}`;

//   try {
//     const response = await fetch(apiUrlArtist, {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Errore nella richiesta: " + response.statusText);
//     }

//     const data = await response.json();
//     console.log("Dati Artista:", data);
//   } catch (error) {
//     console.error("Errore nel recupero dei dati dell'artista:", error);
//   }
// };

// // Funzione per ottenere i dati dell'album
// const getAlbumData = async (token) => {
//   const albumId = "2Cn1d2KgbkAqbZCJ1RzdkA";
//   const apiUrlAlbum = `https://api.spotify.com/v1/albums/${albumId}`;

//   try {
//     const result = await fetch(apiUrlAlbum, {
//       method: "GET",
//       headers: { Authorization: "Bearer " + token },
//     });

//     if (!result.ok) {
//       throw new Error("Errore nella richiesta: " + result.status);
//     }

//     const data = await result.json();
//     console.log("Dati Album:", data);
//     return data;
//   } catch (error) {
//     console.error("Errore nel recupero dei dati dell'album:", error);
//   }
// };

// // Flusso principale
// const main = async () => {
//   const token = await getToken();
//   if (token) {
//     await getArtistData(token);
//     await getAlbumData(token);
//   }
// };

// main();
