import { readCookie } from "./cookies.js";
import { player, playerCarousel, playerTracks, initTracks } from "../assets/js/player.js";
//import variabili
import { trackDataArray } from "../assets/js/player.js";
const artistName = "Antonello Venditti";

const token = readCookie("SpotifyBearer");
if (!token) {
  location.href = "/index.html";
}

async function searchArtistByName(artistName) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.artists && data.artists.items.length > 0) {
      const artist = data.artists.items[0];
      await getArtistData(artist.id);
    } else {
      console.log("Artista non trovato.");
    }
  } catch (error) {
    console.error("Errore nella ricerca dell'artista:", error);
  }
}

async function getArtistData(artistId) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=IT`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log("Dati dell'artista:", data);
    if (data.tracks && data.tracks.length > 0) {
      await playTrack(data.tracks[0].uri); // Assicurati che playTrack sia anche async se necessario
    }
  } catch (error) {
    console.log("Errore nella richiesta dell'artista:", error);
  }
}

// const searchBar = document.getElementById("search-bar");
// const searchButton = document.getElementById("search-button");

// searchButton.addEventListener("click", function () {
//   const artistName = searchBar.value;
//   searchArtistByName(artistName);
// });

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

// let player;

// window.onload = () => {
//   window.onSpotifyWebPlaybackSDKReady = () => {
//     player = new Spotify.Player({
//       name: "Web Playback SDK Quick Start Player",
//       getOAuthToken: (cb) => {
//         cb(token);
//       },
//       volume: 0.5,
//     });
//     console.log(player);
//   };
// };

// Funzione per ottenere la traccia attuale
function getCurrentlyPlayingTrack() {
  const url = `https://api.spotify.com/v1/me/player/currently-playing?market=IT`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.item) {
        const track = data.item;
        document.getElementById("song-title").textContent = track.name;
        document.getElementById("song-artist").textContent = track.artists.map((artist) => artist.name).join(", ");
        document.getElementById("album-cover").src = track.album.images[0].url;
      }
    })
    .catch((error) => console.log("Errore nel caricamento della traccia:", error));
}

// Controlli per play/pausa/skip
// document.getElementById("play-btn").addEventListener("click", () => {
//   fetch(`https://api.spotify.com/v1/me/player/play`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then(() => {
//       document.getElementById("play-btn").style.display = "none";
//       document.getElementById("pause-btn").style.display = "inline";
//     })
//     .catch((error) => console.log("Errore nel riprodurre la traccia:", error));
// });

// document.getElementById("pause-btn").addEventListener("click", () => {
//   fetch(`https://api.spotify.com/v1/me/player/pause`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then(() => {
//       document.getElementById("play-btn").style.display = "inline";
//       document.getElementById("pause-btn").style.display = "none";
//     })
//     .catch((error) => console.log("Errore nel mettere in pausa la traccia:", error));
// });

// Aggiungi controlli per "avanti" e "indietro" in modo simile

// player.addListener("ready", ({ player }) => {
//   setInterval(pippo(player), 3000);
// });
// player.addListener("not_ready", ({ device_id }) => {
//   console.log("Player non pronto con Device ID", device_id);
// });

// player.addListener("initialization_error", ({ message }) => {
//   console.error(message);
// });

// player.addListener("authentication_error", ({ message }) => {
//   console.error(message);
// });

// player.addListener("account_error", ({ message }) => {
//   console.error(message);
// });

// player.addListener("playback_error", ({ message }) => {
//   console.error(message);
// });

// player.connect();

// function playTrack(uri) {
//   fetch(`https://api.spotify.com/v1/me/player/play`, {
//     method: "PUT",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ uris: [uri] }),
//   })
//     .then((response) => {
//       if (response.ok) {
//         console.log("Brano in riproduzione:", uri);
//       } else {
//         console.error("Errore nella riproduzione del brano");
//       }
//     })
//     .catch((error) => {
//       console.error("Errore nel tentativo di riprodurre il brano:", error);
//     });
// }

searchArtistByName(artistName);

const albumsId = ["172vaTORmkS4m1YpuUkYVv", "5gBgPjYAuZGZJPkTgsLfpi", "3gCAXExFUfPYS8w1XKINUb", "3BG3e87NiJLAJG37AoPp4X"];

const carouselRow = document.getElementById("carousel");
const cardsAlbumRow = document.getElementById("cardsAlbum");
const loading = document.getElementById("loading");
const loader = document.getElementById("loader");
const creationButton = document.getElementById("saveList");
const creationInput = document.getElementById("textInput");
const modalist = document.getElementById("modalist");
const modalistItems = Array.from(document.querySelectorAll("#modalist li"));
const tracksSavers = document.getElementsByClassName("saver");
let likePlaylist = JSON.parse(localStorage.getItem("likePlaylist")) || [];
const ar = { id: "Preferiti0", namePlaylist: "Preferiti", tracks: [...likePlaylist] };
let playlists = JSON.parse(localStorage.getItem("playlists"));
// let buonasera = document.querySelector("#buonasera>div");

if (!playlists) {
  playlists = [ar];
  localStorage.setItem("playlists", JSON.stringify(playlists));
}

window.onload = function () {
  initTracks();
  player();
  buildCarouselItems();
  // buonaseraBuilder();
};

function buonaseraBuilder() {
  playlists.forEach((e) => {
    buonasera.innerHTML += `
        <div class="col-6 col-md-4">
            <div
                class="row bg-dark me-2 radius-top-left radius-bottom-left radius-top-right radius-bottom-right">
                <div
                class="col-4 p-0 d-flex flex-wrap radius-top-left overflow-hidden radius-bottom-left imgsContainer">
                    <div class="w-50 p-0 ">
                        <img src="assets/imgs/main/image-11.jpg" alt="img" class="img-fluid h-100 ">
                    </div>
                    <div class="w-50 p-0 ">
                        <img src="assets/imgs/main/image-11.jpg" alt="img" class="img-fluid h-100">
                    </div>
                        <div class="w-50 p-0">
                            <img src="assets/imgs/main/image-11.jpg" alt="img" class="img-fluid h-100">
                        </div>
                         <div class="w-50 p-0 ">
                            <img src="assets/imgs/main/image-11.jpg" alt="img" class="img-fluid h-100">
                         </div>
                    </div>
                        <div class="col-8 p-0 d-flex align-items-center ">
                            <p class="fs-small ps-3 "><a href="playlistsDetail.html?listId=${e.id}" class="text-light text-decoration-none">${e.namePlaylist} </a></p>
                        </div>
                </div>
        </div>`;
  });

  let buonaseraItems = Array.from(document.querySelectorAll(".imgsContainer"));

  for (let j = 0; j < playlists.length; j++) {
    for (let x = 0; x < 4; x++) {
      if (playlists[j].tracks.length === 0) {
        Array.from(buonaseraItems[j].querySelectorAll("img"))[x].src = "./assets/imgs/main/image-1.jpg";
      } else if (playlists[j].tracks.length < 4) {
        Array.from(buonaseraItems[j].querySelectorAll("img"))[x].src = playlists[j].tracks[0].album.cover_small;
      } else {
        Array.from(buonaseraItems[j].querySelectorAll("img"))[x].src = playlists[j].tracks[x].album.cover_small;
      }
    }
  }
}

//-------------------------------------------------------
// Funzione per ottenere i dati dell'album da Spotify
// Funzione per ottenere i dati dell'album da Spotify

function albumData(albumId) {
  const spotifyApiEndpoint = `https://api.spotify.com/v1/albums/${albumId}`;
  loading.style.display = "block";

  fetch(spotifyApiEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((dataAlbum) => {
      console.log(dataAlbum.images.length);
      if (dataAlbum.images && dataAlbum.images.length > 0) {
        const coverImage = dataAlbum.images[0].url; // immagine di copertura
        const albumTracks = dataAlbum.tracks.items; // tracce dell'album

        buildCarousel(albumTracks, coverImage);
        albumTracks.forEach((track) => {
          createAlbumCards(track, dataAlbum); // Passa anche l'album
        });
      } else {
        console.log("Nessuna immagine disponibile per questo album.");
      }
    })
    .catch((error) => {
      console.error("Errore nel recupero dei dati dell'album:", error);
    })
    .finally(() => {
      loading.style.display = "none";
    });
}

function buildCarouselItems() {
  albumsId.forEach((albumId) => {
    albumData(albumId);
  });
}

//----------------------------------------------------------------------
function buildCarousel(datasetArray, coverImage) {
  function truncate(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  datasetArray.forEach((element) => {
    const active = document.querySelectorAll(".carousel-item").length < 1 ? "active" : "";
    const escapedElement = JSON.stringify(element).replace(/"/g, "&quot;");
    // console.log(element);
    carouselRow.innerHTML += `
      <div class="carousel-item ${active}">
          <div class="row p-3 pb-2">
              <div class="col-3 mt-3">
                <img src="${coverImage}" alt="album cover" class="w-100">
              </div>
              <div class="col-7">
                  <h6 class="fs-supersmall">ALBUM</h6>
                  <h1>${truncate(element.name, 14)}</h1>
                  <p class="fs-small">
                    <a href="albumdetails.html" class="text-light text-decoration-none">${element.album ? element.album.title : "Unknown Album"}</a>
                  </p>
                  <p class="fs-small mb-0">${convertDuration(element.duration)}</p>
                  <div class="w-100 d-flex align-items-center">
                      <button onclick='playerCarousel(${escapedElement})' class="btn btn-sm bg-primary rounded-5 px-4 py-2 me-3 h-25 fw-bold text-black">Play</button>
                      <button onclick="salvaModal(${escapedElement})" class="btn btn-sm bg-black text-white rounded-5 px-4 py-2 me-3 h-25 border border-white border-1 saver" data-bs-toggle="modal" data-bs-target="#aggiuntaBrano">Salva</button>
                      <p class="fs-1">...</p>
                  </div>
              </div>
              <div class="col-2">
                  <button disabled class="btn text-gray2 bg-grayground fs-supersmall rounded-5 border-0">NASCONDI ANNUNCI</button>
              </div>
          </div>
      </div>
    `;
  });
}

// Funzione per creare le card____________________________________________
function createAlbumCards(track, album) {
  // Aggiungi la traccia al trackDataArray
  const trackIndex = track.id;
  trackDataArray.push(track);

  // Costruisci la card con i dati dell'album
  cardsAlbumRow.innerHTML += `
    <div class="col-12 col-md-6  rounded scaleHover">
      <div class="card w-100 my-3">
        <img src="${album.images[0].url}" class="card-img-top" alt="${album.name}"> <!-- Immagine dell'album -->
        <div class="card-body ">
          <h5 class="card-title my-2 truncateText"><a href="#" class="text-decoration-none text-white">${album.name}</a></h5>
          <p class="card-text text-secondary mb-4 fs-small">
            <a href="./artist.html?artistId=${track.artists[0].id}" class="text-decoration-none text-white">${track.artists[0].name}</a>
          </p>
          <button type="button" class="btn btn-primary  circle-button position-absolute top-85 end-5 rounded-circle" onclick="playerTracks('${track.uri}')">
            <i class="bi bi-play-fill fs-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ./albumdetails.html?albumId=${track[0].album.id}
//-----------------------------------------------------------

const convertDuration = function (seconds) {
  const minutes = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60;
  return `${minutes}:${remainingSeconds}`;
};

// --------creazione playlist
function creaPL(form) {
  // Controlla se il nome della playlist esiste già. Il nome deve esssere univoco
  const isDuplicate = playlists.some((playlist) => playlist.namePlaylist === form);

  if (isDuplicate) {
    alert("Il nome della playlist esiste già. Scegli un nome diverso.");
  } else {
    // Crea una nuova playlist
    const newPL = { id: form, namePlaylist: form, tracks: [] };
    playlists.push(newPL);
    localStorage.setItem("playlists", JSON.stringify(playlists));
    creationInput.value = "";
    alert("Playlist creata con successo!");
  }
}

//evento per prendere l'input per inserire il nome
creationButton.addEventListener("click", () => {
  const playlistName = creationInput.value.trim();
  if (playlistName) {
    creaPL(playlistName);
  } else {
    alert("Inserisci un nome valido per la playlist.");
  }
});

function salvaModal(track) {
  //qunado premo il pulsante modal salva si apre e compaiono le playlist
  listBuilder(track);
}

// creazione lista e aggiunta dei brani nelle playlist
function listBuilder(track) {
  modalist.innerHTML = "";
  playlists.forEach((element) => {
    const escapedElement = JSON.stringify(track).replace(/"/g, "&quot;"); // Serve per portarmi l'array nella funzione per gestire il lettore
    modalist.innerHTML += `
        <li class="mt-3" data-playlist-id="${element.id}" onclick="addTrackPlaylist(this, ${escapedElement})">
            <a href="#" class="text-decoration-none text-light">${element.namePlaylist}</a>
        </li>
    `;
  });
}

function addTrackPlaylist(listItem, track) {
  let flagAdd = false;
  const playlistId = listItem.getAttribute("data-playlist-id");

  playlists.forEach((el) => {
    if (el.id === playlistId) {
      //controllo id playlist, trova la playlist corrente
      el.tracks.forEach((tr) => {
        //mi vado a ciclare le tracce della playlist corrente
        if (track.id === tr.id) {
          //se è presente questa traccia
          flagAdd = true;
          return;
        }
      });
      if (flagAdd === false) {
        el.tracks.push(track);
        localStorage.setItem("playlists", JSON.stringify(playlists));
        alert("Traccia inserita con successo in" + playlistId);
      }
    }
  });
}

window.playerCarousel = playerCarousel;
window.playerTracks = playerTracks;
window.initTracks = initTracks;
window.salvaModal = salvaModal;
window.addTrackPlaylist = addTrackPlaylist;
