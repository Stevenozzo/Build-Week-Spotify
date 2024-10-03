const token = localStorage.getItem("access_token");

const userId = "qpkkldz3mipajti4lw070gfhl";
const scopes = encodeURIComponent(
  "user-read-private user-read-email user-modify-playback-state user-read-currently-playing playlist-modify-public playlist-modify-private"
);

const authUrl = `https://accounts.spotify.com/authorize?client_id=${userId}&response_type=token&redirect_uri=${encodeURIComponent(
  "http://127.0.0.1:5501/auth.html"
)}&scope=${scopes}`;

if (!token) {
  location.href = "/login.html";
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

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveList").addEventListener("click", () => {
    const artistInput = document.getElementById("textInput").value;
    if (artistInput) {
      searchArtistByName(artistInput);
      createPlaylist();
    } else {
      console.log("Inserisci un nome artista.");
    }
  });

  if (token) {
  } else {
    window.location.href = authUrl;
  }
});
