import { readCookie } from "./cookies.js";

const token = readCookie("SpotifyBearer");
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
      } else {
        console.log("Artista non trovato.");
      }
    })
    .catch((error) => {
      console.log("Errore nella ricerca dell'artista:", error);
    });
}

let albums;
let albumTracks = [];
const imgAlbum = document.getElementById("imgAlbum");

function getArtistData(artistId) {
  fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => response.json())
  .then((data) => {
    albums = data.items;

    // Ensure albums array is populated before using forEach
    if (albums && albums.length > 0) {
      // Populate albums list
      let listaAlbum = document.querySelector(".lista-albums");
      listaAlbum.innerHTML = ""; // Clear previous search results, if any

      albums.forEach((album) => {
        let albumId = album.id;
        const liLista = document.createElement("li");
        liLista.textContent = album.name;

        // Make the <li> clickable
        liLista.style.cursor = "pointer";
        liLista.addEventListener("click", () => {
          // Redirect to album-page.html with the albumId as a URL parameter
          window.location.href = `album-page.html?albumId=${albumId}`;
        });

        listaAlbum.appendChild(liLista);

        // Fetch tracks for each album
        fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((totBrani) => totBrani.json())
        .then((brani) => {
          albumTracks.push(brani);
        });
      });

      console.log("Dati dell'artista:", data);
      console.log("Albums array", albums);
      console.log("Tracks:", albumTracks);
    } else {
      console.log("Nessun album trovato per l'artista.");
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
