// import { player, initTracks, playerAlbumTrack, initArtist, playArtistFunction } from "./player.js";

// const playArtist = document.getElementById("playArtist");
// const addressBarParameters = new URLSearchParams(location.search);
// const artistId = addressBarParameters.get("artistId");
// console.log("artistId", artistId);

////////////////////////////////

const clientId = "7b034cec707f4f8d90a0afdb115bd809";
const clientSecret = "5514452ad2a34ace9f586ac267d2c688";
const authUrlBase = "https://accounts.spotify.com/authorize";

// let apiKeyTemp = "";

// window.onload = function () {
//   initArtist(artistId);
//   player();
// };

// playArtist.addEventListener("click", () => {
//   playArtistFunction();
// });

// const keyUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
// fetch(keyUrl + artistId)
//   .then((response) => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error("errore nella chiamata");
//     }
//   })
//   .then((singleArtist) => {
//     console.log(singleArtist);
//     displayArtistDetails(singleArtist);
//   })
//   .catch((error) => {
//     console.log(error);
//   })
// const keyUrl1 = "/top?limit=11";
// // // fetch(keyUrl + artistId + keyUrl1)
// //   .then((response) => {
// //     if (response.ok) {
// //       return response.json();
// //     } else {
// //       throw new Error("errore");
// //     }
// //   })
// //   .then((singleTrack) => {
// //     console.log(singleTrack);

// //     topTracks(singleTrack);
// //   });

fetch(authUrlBase, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
  },
  body: new URLSearchParams({
    grant_type: "client_credentials",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Errore:", error);
  });

const vendittiId = "3hYLJPJuDyblFKersEaFd6";

const apiUrlArtist = "https://api.spotify.com/v1/artists/${vendittiId}";

//   fetch(apiUrlArtist, {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + apiKeyTemp,
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok: " + response.statusText);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((error) => {
//       console.error("Errore:", error);
//     });

// function displayArtistDetails(singleArtist) {
//   const img = document.getElementById("imgArtist");
//   const artist = document.getElementById("artist");
//   const ascoltatori = document.getElementById("ascoltatori");
//   const follow = document.getElementById("follow");

//   follow.addEventListener("click", function () {
//     if (follow.innerHTML === "Follow") {
//       follow.innerHTML = "Following";
//       follow.style.color = "gray";
//     } else {
//       follow.innerHTML = "Follow";
//       follow.style.color = "white";
//     }
//   });

//   follow.innerHTML = "Follow";
//   img.src = singleArtist.picture_medium;
//   artist.innerText = singleArtist.name;
//   ascoltatori.innerHTML = `${singleArtist.nb_fan} ascoltatori mensili `;
// }

// function topTracks(singleTrack) {
//   const topTrackList = document.getElementById("topTrackList");
//   let tracksHTML = "";

//   singleTrack.data.forEach((track) => {
//     tracksHTML += `
//                 <div class= "row d-flex align-items-center my-2 user-select-none" id="${track.id}">
//                     <div class="col-6 d-flex my-2" onclick='playerAlbumTrack(${track.id})'>
//                         <img src="${track.album.cover_medium}" alt="Album Cover" class="w-10">
//                         <h6 class="mb-0 mt-1 ms-2 title">${truncate(track.title, 15)}</h6>
//                     </div>
//                     <div class="col-3 my-2">
//                         <p class="text-muted ">${track.rank}</p>
//                     </div>
//                     <div class="col-3 my-2">
//                         <p class="text-muted ">${convertDuration(track.duration)}</p>
//                     </div>
//                 </div>

//         `;
//   });

//   topTrackList.innerHTML = tracksHTML;
// }

// function convertDuration(seconds) {
//   const minutes = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60 < 10 ? "0" + (seconds % 60) : seconds % 60;
//   return `${minutes}:${remainingSeconds}`;
// }
// function truncate(text, maxLength) {
//   if (text.length > maxLength) {
//     return text.slice(0, 17) + "...";
//   }
//   return text;
// }

// window.playerAlbumTrack = playerAlbumTrack;
// window.playArtistFunction = playArtistFunction;
