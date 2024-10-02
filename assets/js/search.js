import { player, playerCarousel, playerTracks, initTracks, searchTrack } from "./player.js";

const loading = document.getElementById("loading");
loading.style.display ="none"

window.onload = function () {
    initTracks();
    player();
}

//animazione tasto input
document.addEventListener("DOMContentLoaded", function() {
    const inputSearch = document.querySelector(".inputSearch");
  
    // Espande l'input automaticamente all'apertura della pagina
    inputSearch.classList.add("expanded");
  
    // Ritarda il focus sull'input per farlo sembrare più fluido
    setTimeout(() => {
      inputSearch.focus();
    }, 1000); // Ritardo di 1000 ms (1 secondo)
  });


  document.addEventListener('DOMContentLoaded', function() {
    // Ottieni gli elementi del DOM
    const searchInput = document.querySelector(".inputSearch");
    const scopri = document.getElementById('scopri');
    const listaArtisti = document.getElementById('listaArtisti');
    const listaAlbum = document.getElementById('listaAlbum');
  
    // Verifica se gli elementi sono stati trovati
    if (searchInput) {
      // Funzione per controllare il contenuto dell'input
      function checkInput() {
        // Controlla se l'input è vuoto (spazi vuoti inclusi)
        if (searchInput.value.trim() === '') {
          // Mostra il div 'scopri' e nasconde gli altri
          if (scopri) scopri.style.display = 'flex';
          if (listaArtisti) listaArtisti.style.display = 'none';
          if (listaAlbum) listaAlbum.style.display = 'none';
        } else {
          // Nasconde il div 'scopri' e mostra gli altri
          if (scopri) scopri.style.display = 'none';
          if (listaArtisti) listaArtisti.style.display = 'block';
          if (listaAlbum) listaAlbum.style.display = 'block';
        }
      }
  
      // Aggiungi un event listener per l'evento 'input' sull'input di ricerca
      searchInput.addEventListener('input', checkInput);
  
      // Esegui il controllo iniziale (se l'input ha già testo, ad esempio, dopo un ricaricamento della pagina)
      checkInput();
    } else {
      console.error("Elemento con ID 'searchInput' non trovato.");
    }
  });

let listaArtisti = [];
let listaAlbum = [];
let listaAlbumsTracks = [];
const searchInput = document.getElementById('inputSearch');
const albumsContainer = document.getElementById("listaAlbum");
const artistsContainer = document.getElementById("listaArtisti");
let albums = Array.from(document.getElementsByClassName("albumItem")) || [];
let artists = Array.from(document.getElementsByClassName("artistItem")) || [];



class Alb {
    constructor(name, title, id, cover, tracklist, idArtist, rank, tracks, duration, preview) {
        this.rank = rank;
        this.artista = name;
        this.idArtista = idArtist
        this.titolo = title;
        this.id = id;
        this.cover = cover;
        this.tracklist = tracklist
        this.tracks = tracks || [];
        this.duration = duration;
        this.preview = preview;
    }
}

class Art {
    constructor(title, id, picture) {
        this.nome = title;
        this.id = id;
        this.foto = picture;
    }
}

// Funzione per gestire il clic fuori dall'input
function handleClickOutside(event) {
    // Verifica se il clic è avvenuto al di fuori dell'input
    if (!searchInput.contains(event.target)) {
        searchInput.classList.remove("comparsa");
    }
}

// Aggiungi un listener per i clic su tutto il documento
document.addEventListener("click", handleClickOutside);

// Aggiungi un listener per i clic sull'input
searchInput.addEventListener("click", (e) => {

    searchInput.classList.add("comparsa");

});


async function queryFetch(param) {
    if (param == "") {
        return;
    }

    const url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${param}`;
    loading.style.display = 'block';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Response is not ok!");
        }
        const data = await response.json();

        if (data.data.length > 0) {
            builArtistItems(data);
            buildAlbumItems(data);
        }

    } catch (error) {
        console.error("There was a problem with the fetch operation:", error)
    }finally{
        loading.style.display = "none";
    }
}



searchInput.addEventListener("input", async () => {
    const q = searchInput.value.trim();
    queryFetch(q);
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === 'Enter')
        e.preventDefault();
});



function artistList(dati) {
    listaArtisti = [];
    const artistNames = new Set();
    (dati.data).forEach((element) => {
        if (!artistNames.has(element.artist.name)) {
            artistNames.add(element.artist.name);
            const ar = new Art(element.artist.name, element.artist.id, element.artist.picture_small)
            listaArtisti.push(ar);
        }
    });
    return listaArtisti
}



function albumList(dati) {
    listaAlbum = [];
    const albumTitles = new Set();
    (dati.data).forEach((element) => {
        if (!albumTitles.has(element.album.title)) {
            albumTitles.add(element.album.title);
            const al = new Alb(element.artist.name, element.album.title, element.album.id, element.album.cover_medium, element.album.tracklist, element.artist.id, element.rank, "", element.duration, element.preview);
            listaAlbum.push(al);
        }
    });
    return listaAlbum;
}


function builArtistItems(dati) {
    artists.forEach(item => {
        item.remove();
    })

    artistList(dati).forEach((item, i) => {

        artistsContainer.innerHTML += `
                <div class="row d-flex align-items-center mt-2 artistItem">
                    <div class="col-1 opacity-50">${i+1}</div>
                    <div class="col-1"><img src="${item.foto}" alt="artista" class="w-100 rounded-3"></div>
                    <div class="col-7 d-flex flex-column justify-content-center">
                         <p class="mb-0 "><a href="./artist.html?artistId=${item.id}" class="text-light text-decoration-none">${item.nome}</a></p>
                    </div>
                </div>
        `
    })
    artists = Array.from(document.getElementsByClassName("artistItem"));
}



function buildAlbumItems(dati) {
    albums.forEach(item => {
        item.remove();
    })

    listaAlbumsTracks = [];
    albumList(dati).forEach((item, i) => {
        // albumFetch(item.tracklist);
        albumsContainer.innerHTML += `
        <div class="row d-flex align-items-center mt-2 albumItem scaleHover" data-listaDiTracce = "${item.tracklist}" id= "${item.id}">
            <div class="col-1 opacity-50">${i+1}</div>
            <div class="col-2 col-lg-2 position-relative">
                <img src="${item.cover}" alt="qualcosa" class="w-100 rounded-3">
               <button onclick="searchTrack(${item.id})" type="button" class="btn btn-primary circle-button position-absolute bottom-10 end-10 d-none rounded-circle ">
                    <i class="bi bi-play-fill fs-small fs-4  "></i>
               </button>
            </div>
            <div class="col-5 col-lg-5 d-flex flex-column justify-content-center">
                <p class="mb-0"><a href="./albumDetails.html?albumId=${item.id}" class="text-light text-decoration-none title" >${item.titolo}</a> </p>
                <p class="mb-0 opacity-50"><a href="./artist.html?artistId=${item.idArtista}" class="text-light text-decoration-none">${item.artista}</a></p>
            </div>
            <div class="col-3 opacity-50">${item.rank}</div>
            <div class="col-1 opacity-50">${item.duration}</div>
        </div>
        `;
    })
    albums = Array.from(document.getElementsByClassName("albumItem"));
}

window.searchTrack = searchTrack;





 

// async function albumFetch(parameter) {
//     if (parameter == "") {
//         return;
//     }

//     const url = parameter;
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error("Response is not ok!");
//         }

//         const data = await response.json();

//         if (data.data.length > 0) {
//             albumsTracksList(data);

//             // funzioni di creazione
//         }

//     } catch (error) {
//         console.error("There was a problem with the fetch operation:", error)
//     }
// }



// function albumsTracksList(dati) {
//     listaAlbumsTracks.push(dati.data)
//     return listaAlbumsTracks;
// }