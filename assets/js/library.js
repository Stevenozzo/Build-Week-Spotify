import { player,  albumDataIni } from "./player.js";
const playlists = JSON.parse(localStorage.getItem("playlists"));
const scopri = document.getElementById("scopri");

window.onload = function(){
    albumDataIni("album", "544892012")
    player();
    creazionePlaylist();
}

function creazionePlaylist() {
    if (playlists && playlists.length != 0) {
        playlists.forEach(element => {
            scopri.innerHTML += `
                <div class="col-lg-4 col-sm-3 mt-3 user-select-none">
                    <div class="bg-${coloreRandom()} text-center p-4 rounded-3">
                        <h6><a href="./playlistsDetail.html?listId=${element.id}" class="text-decoration-none text-light">${element.namePlaylist}</a></h6>
                        <p onclick="deletePlaylist('${element.id}')"><i class="bi bi-trash-fill"></i></p>
                    </div>
                </div>
            `;
        });
    }
}
function coloreRandom() {
    const colori = ["red", "primary", "success", "danger", "warning", "info"];
    return colori[Math.floor(Math.random() * colori.length)]
}


function deletePlaylist(playlistId) {
    playlists.forEach((el, i) => {
        if (el.id === playlistId) {
            playlists.splice(i, 1);
            localStorage.setItem("playlists", JSON.stringify(playlists));
            window.location.reload();
        }
    });
}

window.deletePlaylist = deletePlaylist