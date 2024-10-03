// import { player, playerCarousel, playerTracks, initTracks } from "./player.js";
//import variabili
// import { trackDataArray } from "./player.js";

const albumsId = ["11205422", "534017402", "544892012", "420845567", "6327742", "112217392", "6157080", "74872972"];
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
let buonasera = document.querySelector("#buonasera>div");

if (!playlists) {
  playlists = [ar];
  localStorage.setItem("playlists", JSON.stringify(playlists));
}

window.onload = function () {
  // initTracks();
  // player();
  buildCarouselItems();
  buonaseraBuilder();
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
const albumData = function (type, album) {
  const apiKey = `https://striveschool-api.herokuapp.com/api/deezer/${type}/${album}`;
  loading.style.display = "block";

  fetch(apiKey)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("No Album No party");
      }
    })
    .then((dataAlbum) => {
      // const arrayAlbum = Array.from(dataAlbum)
      const albumtracks = Array.from(dataAlbum.tracks.data);
      buildCarousel(albumtracks);
      createAlbumCards(albumtracks);
    })
    .catch((error) => {
      console.error("Errore:", error);
    })
    .finally(() => {
      loading.style.display = "none";
    });
};

function buildCarouselItems() {
  albumsId.forEach((e) => {
    albumData("album", e);
  });
}

//----------------------------------------------------------------------
function buildCarousel(datasetArray) {
  function truncate(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  }

  datasetArray.forEach((element) => {
    const active = document.querySelectorAll(".carousel-item").length < 1 ? "active" : "";
    const escapedElement = JSON.stringify(element).replace(/"/g, "&quot;"); // Serve per portarmi l'array nella funzione per gestire il lettore
    carouselRow.innerHTML += `
            <div class="carousel-item ${active}">
                <div class="row p-3 pb-2">
                    <div class="col-3 mt-3"><img src="${element.album.cover_medium}" alt="imgprova" class="w-100"></div>
                    <div class="col-7">
                        <h6 class="fs-supersmall">ALBUM</h6>
                        <h1>${truncate(element.title_short, 14)}</h1>
                        <p class="fs-small"><a href="albumdetails.html" class="text-light text-decoration-none">${element.album.title}</a></p>
                        <p class="fs-small mb-0">${convertDuration(element.duration)}</p>
                        <div class="w-100 d-flex align-items-center">
                            <button class="btn btn-sm bg-primary rounded-5 px-4 py-2 me-3 h-25 fw-bold text-black">Play</button>
                            <button class="btn btn-sm bg-black text-white rounded-5 px-4 py-2 me-3 h-25 border border-white border-1 saver"  data-bs-toggle="modal" data-bs-target="#aggiuntaBrano">Salva</button>
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
  // tracksSavers = document.getElementsByClassName("saver");
}

// Funzione per creare le card____________________________________________
function createAlbumCards(track) {
  // Aggiungi il track al trackDataArray e ottieni l'indice
  // const trackIndex = trackDataArray.length;
  // trackDataArray.push(track);

  cardsAlbumRow.innerHTML += `
        <div class="col-12 col-md-3 mb-3 rounded scaleHover"
          <div class="card w-25 " >
          <div class="position-relative">
            <img src="${track[0].album.cover_medium}" class="card-img-top rounded mt-2" alt="img album" >  
            <button type="button" class="btn btn-primary circle-button position-absolute bottom-10 end-5  d-none rounded-circle "><i class="bi bi-play-fill fs-4"></i></button>
            </div>        
            
            <div class="card-body d-none">
                <h5 class="card-title my-2 truncateText"><a href = "./albumdetails.html?albumId=${track[0].album.id}"  class="text-decoration-none text-white">${track[0].album.title}</a></h5>
                <p class="card-text mb-4 fs-small "><a href = "./artist.html?artistId=${track[0].artist.id}" class="text-decoration-none text-white">${track[0].artist.name}</a></p>
            </div>
        </div>`;
}

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

// window.playerCarousel = playerCarousel;
// window.playerTracks = playerTracks;
// window.initTracks = initTracks;
// window.salvaModal = salvaModal;
// window.addTrackPlaylist = addTrackPlaylist;
