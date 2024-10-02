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
const albumId = getParamFromUrl("albumId");
const artistId = getParamFromUrl("artistId")
console.log('Album ID:', albumId);





let albumName;
let artistName;
let artistImage;
let releaseDate;
let albumImage;
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
        
        albumTracks = brani.items.map((brano) => ({
            name: brano.name,
            duration: brano.duration_ms,
            id: brano.id
        }));

        console.log(albumTracks); // This will be available when the fetch is complete
    } catch (error) {
        console.log("Errore nella richiesta dei brani:", error);
    }
}

function renderAlbumTracks() {
    const ulElement = document.getElementById("tracks-list"); // The <ul> element where the <li> elements will be appended

    // Clear the existing content in the list (optional if you're updating the list multiple times)
    ulElement.innerHTML = "";

    albumTracks.forEach((track, index) => {
        // Create a new <li> element
        const liElement = document.createElement("li");
        liElement.classList.add("flex", "space-between");

        // Convert duration from milliseconds to minutes and seconds
        const minutes = Math.floor(track.duration / 60000);
        const seconds = ((track.duration % 60000) / 1000).toFixed(0);
        // const formattedDuration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        // Set the HTML content for the <li> using template literals
        liElement.innerHTML = `
            <div class="flex width-40">
                <p class="track-number">${index + 1}</p>
                <div>
                    <p class="track-name">${track.name}</p> 
                    <p class="track-artist">${artistName}</p> 
                </div>
            </div>
            <p class="width-30 text-end">riproduzioni totali</p> <!-- Track duration -->
            <p class="width-30 text-end">${minutes}h ${seconds}s</p> <!-- Custom time formatting -->
        `;

        // Append the <li> to the <ul> list
        ulElement.appendChild(liElement);
    });
}



let resultImage = document.getElementById("album-image");
let resultArtistName = document.getElementById("artist-name");
let resutRelease = document.getElementById("release");
let reusltTracksNr = document.getElementById("trackNr");
let resultArtistImg = document.getElementById("artist-image");
let resultTitle = document.getElementById("album-title");


async function populatePage() {
    await getAlbumInfo(albumId);
    await getArtistInfo(artistId);
    await getAlbumTracks(albumId);
    console.log("Album Name:", albumName);
    console.log("Artist Name:", artistName);
    console.log("Release Date:", releaseDate);
    console.log("Album Image URL", albumImage);
    resultImage.src = albumImage;
    import('./js/bg-gradient.js')
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
    


}

populatePage();