import { readCookie } from "./cookies.js";

const token = readCookie("SpotifyBearer");

if (!token) {
  location.href = "/index.html";
}

const urlParam = new URLSearchParams(window.location.search);
const artistName = urlParam.get("artistName");

let artistId;
let topTracksInfo = [];

const getArtistData = async () => {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.artists.items.length > 0) {
      artistId = data.artists.items[0].id;
      getImageUrl(data); // Update page with artist info
      console.log("ID Artista:", artistId);

      await getArtistTracks(artistId); // Wait for tracks to be fetched
      populatePage(); // Call populatePage after getting tracks
    } else {
      console.log("Artista non trovato");
    }
  } catch (error) {
    console.error("Errore:", error);
  }
};

const getImageUrl = (data) => {
  const imageUrl = data.artists.items[0].images[0].url;
  console.log(imageUrl);

  const div = document.getElementById("partesuperiore");
  div.style.backgroundImage = `url(${imageUrl})`;
  div.style.backgroundSize = "contain";
  div.style.backgroundPosition = "center";
  div.style.backgroundRepeat = "no-repeat";
  div.style.height = "60vh";
  div.style.position = "relative";

  const h1 = document.querySelector("h1");
  h1.innerText = artistName;

  const h2 = document.createElement("h2");
  h2.innerText = `Followers: ${data.artists.items[0].followers.total}`;
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

const mostraTracce = (trackName, trackImg, index) => {
  const container = document.getElementById("topTrackList");
  const trackElement = document.createElement("div");
  trackElement.setAttribute("id", "trackList");
  trackElement.innerHTML = `<div class="tracksList d-flex align-center">
      <p style="margin-top:auto; margin-bottom:auto; width:40px; height:40px" class="px-2 d-flex align-center justify-content-center">${index + 1}</p>
      <img style="margin-top:auto; margin-bottom:auto; margin-inline:1rem" id="singleImgTopTrack" src="${trackImg}" alt="trackImg" width=60 height=60>
      <div class="d-flex flex-column">
          <p class="m-0">${trackName}</p> 
          <p style="color:#A7A7A6" class="m-0">${artistName}</p> 
      </div>
    </div>`;
  container.appendChild(trackElement);
};

const getArtistTracks = async (artistId) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Dati dell'artista:", data);
    console.log("Tracce dell'artista:", data.tracks);

    for (const track of data.tracks) {
      topTracksInfo.push({
        trackName: track.name,
        trackImg: track.album.images[0].url,
        trackDuration: track.duration_ms,
      });
    }
  } catch (error) {
    console.log("Errore nella richiesta delle tracce:", error);
  }
};

const populatePage = () => {
  topTracksInfo.forEach((track, index) => {
    mostraTracce(track.trackName, track.trackImg, index);
  });
};

// Call the function to fetch artist data and tracks
getArtistData();
