import { readCookie } from "./cookies.js";

const token = readCookie("SpotifyBearer");

// Valorizzazione dell'User ID e degli scope
const userId = "qpkkldz3mipajti4lw070gfhl"; // Inserisci qui il tuo User ID
const scopes = encodeURIComponent(
  "user-read-private user-read-email user-modify-playback-state user-read-currently-playing playlist-modify-public playlist-modify-private"
);

const authUrl = `https://accounts.spotify.com/authorize?client_id=${userId}&response_type=token&redirect_uri=${encodeURIComponent(
  "http://127.0.0.1:5501/auth.html"
)}&scope=${scopes}`;

// Controlla se l'utente è autenticato
if (!token) {
  location.href = "/index.html"; // Reindirizza se non autenticato
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
    .then((response) => response.json())
    .then((data) => {
      console.log("Album dell'artista:", data);
    })
    .catch((error) => {
      console.log("Errore nel recupero degli album:", error);
    });
}

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
    })
    .catch((error) => {
      console.log("Errore:", error);
    });
}

// Assicurati che il codice venga eseguito dopo che il DOM è completamente carico
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search-btn").addEventListener("click", () => {
    const artistInput = document.getElementById("artist-input").value;
    if (artistInput) {
      searchArtistByName(artistInput);
      createPlaylist(); // Crea la playlist quando l'utente inserisce un artista
    } else {
      console.log("Inserisci un nome artista.");
    }
  });

  // Esegui la ricerca per l'artista all'avvio, se necessario
  if (token) {
    // Non avviamo la creazione della playlist automaticamente, solo su input
  } else {
    window.location.href = authUrl; // Reindirizza per l'autenticazione se il token non è presente
  }
});
