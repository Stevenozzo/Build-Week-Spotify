import { readCookie } from "./cookies.js";

const token = readCookie("SpotifyBearer");
if (token) {
} else {
  window.location.href = authUrl;
}

const userId = "qpkkldz3mipajti4lw070gfhl";
const scopes = encodeURIComponent(
  "user-read-private user-read-email user-modify-playback-state user-read-currently-playing playlist-modify-public playlist-modify-private"
);

const authUrl = `https://accounts.spotify.com/authorize?client_id=${userId}&response_type=token&redirect_uri=${encodeURIComponent(
  "http://127.0.0.1:5501/auth.html"
)}&scope=${scopes}`;

if (!token) {
  location.href = "/index.html";
}

function searchArtistByName(artistName) {
  fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
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
  fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=IT`, {
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

function getAlbums(artistId) {
  fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero degli album");
      }
    })
    .then((data) => {
      console.log("Album dell'artista:", data);
    })
    .catch((error) => {
      console.log("Errore nel recupero degli album:", error);
    });
}

let createdPlaylistId; // Variabile per memorizzare l'ID della playlist

function createPlaylist() {
  fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "New Playlist",
      description: "Playlist creata tramite l'API di Spotify",
      public: false,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore durante la creazione della playlist");
      }
    })
    .then((data) => {
      console.log("Playlist creata con successo:", data);
      createdPlaylistId = data.id; // Salva l'ID della playlist
      console.log("ID Playlist creata:", createdPlaylistId); // Stampa l'ID per verifica
      checkPlaylist(createdPlaylistId); // Chiama la funzione per controllare la playlist
    })
    .catch((error) => {
      console.log("Errore:", error);
    });
}

// Funzione per controllare se la playlist è stata creata
function checkPlaylist(playlistId) {
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore durante il recupero della playlist");
      }
    })
    .then((data) => {
      console.log("Dettagli della playlist:", data);
    })
    .catch((error) => {
      console.log("Errore:", error);
    });
}

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  const artistInputField = document.getElementById("textInput");

  e.preventDefault();
  const artistInput = artistInputField.value;
  console.log("Valore al clic:", artistInput);
  createPlaylist(); // Assicurati di chiamare createPlaylist qui se vuoi creare la playlist al submit del form
});
