import { readCookie } from "../../js/cookies.js";
import { getToken } from "./token.js";
const tempToken = localStorage.getItem("tempToken");

window.onSpotifyWebPlaybackSDKReady = async () => {
  const token = await getToken();
  const player = new window.Spotify.Player({
    name: "Web Playback SDK",
    getOAuthToken: (cb) => {
      cb(tempToken);
    },
    volume: 0.5,
  });

  // setplayer da definire

  player.addListener("ready", ({ device_id }) => {
    console.log("Ready with Device ID", device_id);
  });

  player.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  player.connect();
};

// Controlli per play/pausa/skip
// document.getElementById("play-btn").addEventListener("click", () => {
//   fetch(`https://api.spotify.com/v1/me/player/play`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then(() => {
//       document.getElementById("play-btn").style.display = "none";
//       document.getElementById("pause-btn").style.display = "inline";
//     })
//     .catch((error) => console.log("Errore nel riprodurre la traccia:", error));
// });

// document.getElementById("pause-btn").addEventListener("click", () => {
//   fetch(`https://api.spotify.com/v1/me/player/pause`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then(() => {
//       document.getElementById("play-btn").style.display = "inline";
//       document.getElementById("pause-btn").style.display = "none";
//     })
//     .catch((error) => console.log("Errore nel mettere in pausa la traccia:", error));
// });

// Aggiungi controlli per "avanti" e "indietro" in modo simile

// player.addListener("ready", ({ player }) => {
//   setInterval(pippo(player), 3000);
// });
// player.addListener("not_ready", ({ device_id }) => {
//   console.log("Player non pronto con Device ID", device_id);
// });

// player.addListener("initialization_error", ({ message }) => {
//   console.error(message);
// });

// player.addListener("authentication_error", ({ message }) => {
//   console.error(message);
// });

// player.addListener("account_error", ({ message }) => {
//   console.error(message);
// });

// player.addListener("playback_error", ({ message }) => {
//   console.error(message);
// });

// player.connect();

// function playTrack(uri) {
//   fetch(`https://api.spotify.com/v1/me/player/play`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ uris: [uri] }),
//   })
//     .then((response) => {
//       if (response.ok) {
//         console.log("Brano in riproduzione:", uri);
//       } else {
//         console.error("Errore nella riproduzione del brano");
//       }
//     })
//     .catch((error) => {
//       console.error("Errore nel tentativo di riprodurre il brano:", error);
//     });
// }
