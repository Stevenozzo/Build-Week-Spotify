import { readCookie } from "./js/cookies.js";

const token = readCookie("SpotifyBearer");
if (!token) {
  location.href = "/index.html";
}

// Function to get a parameter by name from the URL
function getParamFromUrl(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

// Example usage: Get the 'albumId' parameter from the URL
const albumId = getParamFromUrl('albumId');
console.log('Album ID:', albumId);

let albumTracks = [];
function getArtistData(albumId) {
    fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((totBrani) => totBrani.json())
    .then((brani) => {
    albumTracks.push(brani);
    console.log("Tracks:", albumTracks);
    })
    .catch((error) => {
      console.log("Errore nella richiesta dell'artista:", error);
    });
}

getArtistData(albumId);
  