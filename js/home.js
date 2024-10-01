function readCookie(nomecookie) {
  let cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key.trim() === nomecookie) {
      return value;
    }
  }
  return null;
}

function searchArtistByName(artistName) {
  const token = readCookie("SpotifyBearer");
  if (!token) {
    console.log("Token non trovato!");
    return;
  }

  fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.artists && data.artists.items.length > 0) {
        const venditti = data.artists.items[0];
        console.log("Artista trovato:", venditti);

        getArtistData(venditti.id);
      } else {
        console.log("Artista non trovato.");
      }
    })
    .catch((error) => {
      console.log("Errore nella ricerca dell'artista:", error);
    });
}

function getArtistData(artistId) {
  const token = readCookie("SpotifyBearer");
  if (!token) {
    console.log("Token non trovato!");
    return;
  }

  fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Dati dell'artista:", data);
    })
    .catch((error) => {
      console.log("Errore nella richiesta dell'artista:", error);
    });
}

const artistName = "Antonello Venditti";
searchArtistByName(artistName);
