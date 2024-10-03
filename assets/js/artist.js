import { readCookie } from "../../js/cookies.js";

const token = readCookie("SpotifyBearer");
if (!token) {
  location.href = "/index.html";
}

const urlParam = new URLSearchParams(window.location.search);

const artistName = urlParam.get("artistName");

let artistId;
console.log(artistName);
let currTrack;

/*function getArtistData() {
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
}*/

function getArtistData() {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    artistName
  )}&type=artist&limit=1`;

  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.artists.items.length > 0) {
        artistId = data.artists.items[0].id;
        getImageUrl(data);
        console.log("ID Artista:", artistId);
        getArtistTracks(artistId);
      } else {
        console.log("Artista non trovato");
      }
    })
    .catch((error) => console.error("Errore:", error));
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

/*function getArtistTracks(artistId) {
  fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(artistId);
      console.log("Dati dell'artista:", data);
      console.log("Tracce dell'artista:", data.tracks);
    })
    .catch((error) => {
      console.log("Errore nella richiesta dell'artista:", error);
    });
}*/

function getArtistTracks(artistId) {
  fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Dati dell'artista:", data);
      console.log("Tracce dell'artista:", data.tracks);
      data.tracks.forEach((track) => {
        fetch(`https://api.spotify.com/v1/tracks/${track.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((img) => {
            console.log("tracce", img);

            img.forEach((immagine) => {
              mostraTracce(data.tracks, immagine);
            });
          });
      });
    })
    .catch((error) => {
      console.log("Errore nella richiesta dell'artista:", error);
    });
}
function mostraTracce(tracks, img) {
  const container = document.getElementById("topTrackList");
  container.innerHTML = "";

  tracks.forEach((track, index) => {
    const trackElement = document.createElement("div");
    trackElement.setAttribute("id", "trackList");
    trackElement.innerHTML = `<div class="d-flex align-center">
        <p class="px-2 d-flex align-center">${index + 1}</p>
        <img src="${img.album.images[0].url}" alt="">
        <div class="d-flex flex-column">
            <p class="">${track.name}</p> 
            <p class="">${artistName}</p> 
        </div>
      </div>`;
    container.appendChild(trackElement);
  });
}

getArtistData();
