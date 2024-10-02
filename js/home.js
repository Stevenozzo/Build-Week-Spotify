import { readCookie } from "./cookies.js";
const artistName = "Antonello Venditti";

const token = readCookie("SpotifyBearer");
if (!token) {
  location.href = "/index.html";
}

function searchArtistByName(artistName) {
  fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      artistName
    )}&type=artist`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.artists && data.artists.items.length > 0) {
        const artist = data.artists.items[0];
        console.log(data);
        console.log("Artista trovato:", artist);

        getArtistData(artist.id);
        getAlbums(artist.id);
      } else {
        console.log("Artista non trovato.");
      }
    })
    .catch((error) => {
      console.log("Errore nella ricerca dell'artista:", error);
    });
}

function getArtistData(artistId) {
  fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Dati dell'artista:", data);
      if (data.tracks && data.tracks.length > 0) {
        playTrack(data.tracks[0].uri);
      }
    })
    .catch((error) => {
      console.log("Errore nella richiesta dell'artista:", error);
    });
}

const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", function () {
  const artistName = searchBar.value;
  searchArtistByName(artistName);
});

// Funzione per ottenere gli album dell'artista
function getAlbums(artistId) {
  fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Album dell'artista:", data);
    })
    .catch((error) => {
      console.log("Errore nel recupero degli album:", error);
    });
}

let player;

window.onSpotifyWebPlaybackSDKReady = () => {
  player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });
  function pippo(player) {
    console.log("Player pronto con Device ID", player);
  }
};

player.addListener("ready", ({ player }) => {
  setInterval(pippo(player), 3000);
});
player.addListener("not_ready", ({ device_id }) => {
  console.log("Player non pronto con Device ID", device_id);
});

player.addListener("initialization_error", ({ message }) => {
  console.error(message);
});

player.addListener("authentication_error", ({ message }) => {
  console.error(message);
});

player.addListener("account_error", ({ message }) => {
  console.error(message);
});

player.addListener("playback_error", ({ message }) => {
  console.error(message);
});

player.connect();

function playTrack(uri) {
  fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris: [uri] }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Brano in riproduzione:", uri);
      } else {
        console.error("Errore nella riproduzione del brano");
      }
    })
    .catch((error) => {
      console.error("Errore nel tentativo di riprodurre il brano:", error);
    });
}

searchArtistByName(artistName);
