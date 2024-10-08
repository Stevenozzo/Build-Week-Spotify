import { readCookie } from "./cookies.js";

const token = readCookie("SpotifyBearer");
if (!token) {
  location.href = "/index.html";
}

// let player;
let progressInterval; 
import { initSpotifyPlayer, nextTrack, previousTrack, player } from './player.js';

function getParamFromUrl(paramName) {
  return new URLSearchParams(window.location.search).get(paramName);
}

const albumId = getParamFromUrl("albumId");
const artistId = getParamFromUrl("artistId");

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}h ${seconds < 10 ? "0" : ""}${seconds}s`;
}

async function fetchArtistInfo(id) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const artist = await response.json();
    return { name: artist.name, image: artist.images[2].url };
  } catch (error) {
    console.error("Error fetching artist info:", error);
    return {};
  }
}

async function fetchAlbumInfo(id) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const album = await response.json();
    return {
      name: album.name,
      artistName: album.artists[0].name,
      releaseDate: album.release_date,
      image: album.images[0].url,
      tracks: album.tracks.items.map(track => ({
        name: track.name,
        duration: track.duration_ms,
        explicit: track.explicit,
        uri: track.uri  // This is necessary for full playback
      }))
    };
  } catch (error) {
    console.error("Error fetching album info:", error);
    return {};
  }
}

async function fetchArtistPlaylists(artistName) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=playlist&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    return data.playlists.items;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}

function renderAlbumTracks(tracks, artistName) {
  const ulElement = document.getElementById("tracks-list");
  let totalDuration = 0;

  let trackHtml = tracks.map((track, index) => {
      totalDuration += track.duration;
      return `
          <li class="flex space-between p-1 track-item" data-track-uri="${track.uri}">
              <div class="flex width-30 align-center">
                  <p class="flex p-1 align-center square-40 justify-end">${index + 1}</p>
                  <div class="flex column justify-center">
                      <p class="f-white">${track.name}</p> 
                      <p class="flex align-center">${track.explicit ? `<span class="explicit me-05">E</span>` : ''}${artistName}</p>
                  </div>
              </div>
              <p class="width-30 flex align-center justify-end pe-1">${formatDuration(track.duration)}</p>
          </li>
      `;
  }).join("");

  ulElement.innerHTML = trackHtml;

  // Add event listeners to each track item to play the full track when clicked
  document.querySelectorAll('.track-item').forEach(item => {
      item.addEventListener('click', function () {
          const trackUri = this.getAttribute('data-track-uri');
          if (trackUri && player) {
              player._options.getOAuthToken(access_token => {
                  fetch(`https://api.spotify.com/v1/me/player/play`, {
                      method: 'PUT',
                      body: JSON.stringify({ uris: [trackUri] }),
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${access_token}`
                      },
                  }).then(() => {
                      console.log(`Playing track ${trackUri}`);
                  }).catch(err => console.error("Error playing track:", err));
              });
          } else {
              console.error("Track URI is not defined or player is not initialized.");
          }
      });
  });
}


function renderArtistPlaylists(playlists, artistName) {
  const headerElement = document.getElementById("playlist-header");
  headerElement.innerHTML = `<h4 class="p-1">Playlists for <br> ${artistName}</h4>`;
  let playlistHtml = playlists.map(playlist => {
    const playlistImage = playlist.images.length > 0 ? playlist.images[0].url : 'default-image.jpg';
    return `
      <li class="flex space-between py-05">
        <div class="flex align-center ps-1" style="color:#B3B3B3">
          <img src="${playlistImage}" class="square-50" alt="Playlist Image">
          <div class="flex column justify-center px-1">
            <p>${playlist.name}</p>
            <p>${playlist.owner.display_name}</p>
          </div>
        </div>
        <p class="flex align-center text-end pe-1 justify-end width-30" style="color:#B3B3B3">${playlist.tracks.total} tracks</p>
      </li>
    `;
  }).join("");

  headerElement.innerHTML += playlistHtml;
}

async function populatePage() {
  const [albumInfo, artistInfo] = await Promise.all([
    fetchAlbumInfo(albumId),
    fetchArtistInfo(artistId)
  ]);

  document.getElementById("album-image").src = albumInfo.image;
  document.getElementById("artist-name").innerText = artistInfo.name;
  document.getElementById("release").innerText = albumInfo.releaseDate;
  document.getElementById("trackNr").innerText = `${albumInfo.tracks.length} brani`;
  document.getElementById("album-title").innerText = albumInfo.name;
  document.getElementById("artist-image").src = artistInfo.image;

  renderAlbumTracks(albumInfo.tracks, albumInfo.artistName);


  const artistPlaylists = await fetchArtistPlaylists(albumInfo.artistName);
  if (artistPlaylists.length > 0) {
    renderArtistPlaylists(artistPlaylists, artistInfo.name);
  }
  
  import('./bg-gradient.js')
  .then(() => console.log('bg-gradient.js has been loaded'))
  .catch((error) => console.error('Error loading bg-gradient.js:', error));
  
  document.querySelector('main').classList.remove("hidden");
}

populatePage();


window.onSpotifyWebPlaybackSDKReady = () => {
  initSpotifyPlayer(albumId, token); // Initialize the player with album tracks and token
};

// Hook up previous and next buttons to the exported functions
document.getElementById("prev-btn").addEventListener("click", previousTrack);
document.getElementById("next-btn").addEventListener("click", nextTrack);

// Play/Pause controls can also be hooked up here
document.getElementById("play-btn").addEventListener("click", () => {
  player.resume().then(() => {
    console.log('Playback resumed');
  });
});

document.getElementById("pause-btn").addEventListener("click", () => {
  player.pause().then(() => {
    console.log('Playback paused');
  });
});
