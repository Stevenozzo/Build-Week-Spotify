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
        getalbums(artist.id);
      } else {
        console.log("Artista non trovato.");
      }
    })
    .catch((error) => {
      console.log("Errore nella ricerca dell'artista:", error);
    });
}
let albums = [];
let albumTracks = [];
const imgAlbum = document.getElementById("imgAlbum").src;

function getArtistData(artistId) {
  fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => response.json())
  .then((data) => {
    albums.push(data);
    // console.log(albums[0].items[0].img[0].url);
    // console.log(albums[0].items[0])
    data.items.forEach((album) => {
      let albums = album.id;
      fetch(`https://api.spotify.com/v1/albums/${albums}/tracks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((totBrani) => totBrani.json())
      .then((brani)=> {
        albumTracks.push(brani);
        // console.log(brani);
        
      })
      
    })
    console.log("Dati dell'artista:", data);
  })
  .catch((error) => {
    console.log("Errore nella richiesta dell'artista:", error);
  });
}

console.log(albums);
console.log(albumTracks);

// console.log(albums[0].items[0])

const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", function () {
  const artistName = searchBar.value;
  searchArtistByName(artistName);
});

const getalbums = (artist) => {
  fetch();
};

// const artistName = "Antonello Venditti";
// searchArtistByName(artistName);
