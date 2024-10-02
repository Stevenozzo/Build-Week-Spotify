import { player, playerAlbumTrack, playArtistFunction, initLikePlaylist, initPlaylist } from "./player.js";
let likePlaylist = JSON.parse(localStorage.getItem('likePlaylist')) || [];
const urlParam = new URLSearchParams(location.search).get("listId");
const playlists = JSON.parse(localStorage.getItem("playlists"));


const playArtist = document.getElementById("playArtist");

window.onload = function () {
    displayAlbumDetails();
    initPlaylist(urlParam)
    player();
    //initLikePlaylist()

}

playArtist.addEventListener("click", () => {
    playArtistFunction()
})


function displayAlbumDetails() {
    const titleAlbum = document.getElementById('title');
    const artist = document.getElementById('artist');
    const trackList = document.getElementById('lists');

    titleAlbum.innerText = urlParam;
    trackList.innerHTML = '';
    let trackHTML = '';



    if(playlists.length != 0){
        playlists.forEach((element) => {
            if (element.id === urlParam) {
                for (let i = 0; i < element.tracks.length; i++) {
                    trackHTML += `
                    <div class="row user-select-none" id="${element.tracks[i].id}">
                        <div class="col-1 text-muted d-flex align-items-center">
                            ${i +1}
                        </div>
                        <div class="col-6" onclick='playerAlbumTrack(${element.tracks[i].id})'>
                        <div class="d-flex align-items-center">
                        <img class="w-10 me-3 rounded-3" src="${element.tracks[i].album.cover_small}"/>
                         <ol class="list-unstyled mb-0">
                                <li class="title">${truncate(element.tracks[i].title_short, 20)}</li>
                                <a href="./artist.html?artistId=${element.tracks[i].artist.id}" class="no-underline text-undertitle text-decoration-none">${element.tracks[i].artist.name}</a>
                            </ol>
                        </div>
                           
                        </div>
                        <div class="col-4 ">
                        </div>
                        <div class="col-1 "> 
                            <ol class="list-unstyled mb-0 d-flex align-items-center">
                                <li class="text-muted">${convertDuration(element.tracks[i].duration)}</li>
                            </ol>
                        </div>
                    </div>
                `;
                }
            };
        });
    }


    trackList.innerHTML = trackHTML;
}

function convertDuration(seconds) {
    const minutes = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60 < 10 ? "0" + seconds % 60 : seconds % 60;
    return `${minutes}:${remainingSeconds}`;
}

function truncate(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}


window.playerAlbumTrack = playerAlbumTrack;
