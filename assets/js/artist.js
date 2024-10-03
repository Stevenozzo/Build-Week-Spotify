const token = localStorage.getItem("access_token");
console.log(token);
if (!token) {
  location.href = "/index.html";
}

const urlParam = new URLSearchParams(window.location.search);

const artistName = urlParam.get("artistName");
console.log(artistName);

function getArtistData() {
  fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("errore nella get");
      }
    })
    .then((data) => {
      console.log("Dati dell'artista:", data);
      getImageUrl(data);

      // if (data.tracks && data.tracks.length > 0) {
      //   playTrack(data.tracks[0].uri);
      // }
    })
    .catch((error) => {
      console.log("Errore nella richiesta dell'artista:", error);
    });
}

const getImageUrl = (data) => {
  const imageUrl = data.artists.items[0].images[0].url;
  console.log(imageUrl);

  const div = document.getElementById("partesuperiore");

  div.style.backgroundImage = `url(${imageUrl})`;
  div.style.backgroundSize = "cover";
  div.style.backgroundPosition = "center";
  div.style.height = "60vh";
  div.style.position = "relative";
  div.style.display = "flex";
  div.style.alignItems = "flex-end";
  div.style.padding = "20px";

  const h1 = document.querySelector("h1");
  h1.innerText = artistName;

  const h2 = document.createElement("h2");
  h2.innerText = `
  followers 
  ${data.artists.items[0].followers.total}
  `;
  h2.style.color = "white";
  h2.style.fontSize = "1rem";
  h2.style.margin = "0";
  h2.style.position = "absolute";
  h2.style.bottom = "20px";
  h2.style.left = "20px";
  h2.style.padding = "10px";
  h2.style.borderRadius = "8px";

  div.appendChild(h2);
};
getArtistData();

function getFirstTrackId(artistName) {
  // Passo 1: Trova l'artista usando il suo nome
  fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((searchData) => {
      if (searchData.artists.items.length === 0) {
        console.error("Nessun artista trovato con questo nome.");
        return null;
      }

      const artistId = searchData.artists.items[0].id; // Ottieni l'ID del primo artista trovato

      // Passo 2: Ottieni le tracce dell'artista
      return fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then((tracksResponse) => {
      if (!tracksResponse) return; // Se non ci sono tracce, esci
      return tracksResponse.json();
    })
    .then((tracksData) => {
      if (tracksData.tracks.length === 0) {
        console.error("Nessuna traccia trovata per questo artista.");
        return null;
      }

      const firstTrackId = tracksData.tracks[1].id; // Ottieni l'ID della prima traccia
      console.log("ID della prima traccia:", firstTrackId);
      return firstTrackId;
    })
    .catch((error) => {
      console.error("Errore:", error);
    });
}

// Esempio di utilizzo
getFirstTrackId(artistName);

fetch("https://api.spotify.com/v1/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((response) => {
  if (response.ok) {
    console.log("Token valido.");
  }
});

fetch("https://api.spotify.com/v1/me/player/devices", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Dispositivi attivi:", data.devices);
  });
