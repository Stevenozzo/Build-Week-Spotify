import { readCookie } from "./cookies.js";

const token = readCookie("SpotifyBearer");
if (!token) {
  location.href = "/index.html";
}


function getParamFromUrl(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

const albumId = getParamFromUrl("albumId");
const artistId = getParamFromUrl("artistId")
console.log('Album ID:', albumId);





let albumName;
let artistName;
let artistImage;
let releaseDate;
let albumImage;
let totalDuration = 0;
let albumTracks = [];


async function getArtistInfo(Id) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${Id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const artist = await response.json();

        console.log(artist);
        artistImage = artist.images[2].url;      
    } catch (error) {
        console.log("Errore nella richiesta dell'artista:", error);
    }
}

async function getAlbumInfo(Id) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${Id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const album = await response.json();


        console.log(album);
        // Now the values are available
        albumName = album.name;
        artistName = album.artists[0].name;
        releaseDate = album.release_date;
        albumImage = album.images[0].url;
        
    } catch (error) {
        console.log("Errore nella richiesta dei brani:", error);
    }
}

async function getAlbumTracks(Id) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${Id}/tracks`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const brani = await response.json();
        console.log(brani);
        albumTracks = brani.items.map((brano) => ({
            name: brano.name,
            duration: brano.duration_ms,
            id: brano.id,
            explicit: brano.explicit
        }));

        console.log(albumTracks); // This will be available when the fetch is complete
    } catch (error) {
        console.log("Errore nella richiesta dei brani:", error);
    }
}

function renderAlbumTracks() {
    const ulElement = document.getElementById("tracks-list");
    ulElement.innerHTML = "";

    albumTracks.forEach((track, index) => {

        const liElement = document.createElement("li");
        liElement.classList.add("flex", "space-between", "p-1");

        totalDuration += track.duration;

        const minutes = Math.floor(track.duration / 60000);
        const seconds = ((track.duration % 60000) / 1000).toFixed(0);

        liElement.innerHTML = `
            <div class="flex width-30 align-center">
                <p class="flex p-1 align-center square-40 justify-end">${index + 1}</p>
                <div class="flex column justify-center">
                    <p class="f-white">${track.name}</p> 
                    <p class="flex align-center">${track.explicit ? `<span class="explicit">E</span>` : ``}${artistName}</p> 
                </div>
            </div>
            <p class="width-30 flex align-center justify-end pe-1">${minutes}h ${seconds}s</p> <!-- Custom time formatting -->
        `;

        ulElement.appendChild(liElement);
    });

    const totalMinutes = Math.floor(totalDuration / 60000);
    const totalSeconds = ((totalDuration % 60000) / 1000).toFixed(0);
    const formattedTotalDuration = `${totalMinutes} min ${totalSeconds < 10 ? "0" : ""}${totalSeconds} sec`;
    totalDuration = formattedTotalDuration;
}



let resultImage = document.getElementById("album-image");
let resultArtistName = document.getElementById("artist-name");
let resutRelease = document.getElementById("release");
let reusltTracksNr = document.getElementById("trackNr");
let resultArtistImg = document.getElementById("artist-image");
let resultTitle = document.getElementById("album-title");
let reusltTotDur = document.getElementById("tot-duration");
let pageContent = document.querySelector('main');

async function populatePage() {
    await getAlbumInfo(albumId);
    await getArtistInfo(artistId);
    await getAlbumTracks(albumId);
    console.log("Album Name:", albumName);
    console.log("Artist Name:", artistName);
    console.log("Release Date:", releaseDate);
    console.log("Album Image URL", albumImage);
    resultImage.src = albumImage;
    import('./bg-gradient.js')
        .then(() => {
        console.log('bg-gradient.js has been loaded');
        })
        .catch((error) => {
        console.error('Error loading bg-gradient.js:', error);
    });

    resultArtistImg.src = artistImage;
    resultArtistName.innerText = artistName; 
    resutRelease.innerText = releaseDate;
    reusltTracksNr.innerText = `${albumTracks.length} brani`;
    resultTitle.innerText = albumName;
    
    renderAlbumTracks();
    reusltTotDur.innerText = totalDuration;

    setTimeout(() => {
        pageContent.classList.remove("hidden");
    }, 100);


}

populatePage();