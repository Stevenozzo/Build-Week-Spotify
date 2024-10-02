let flagLoop = false;
const shuffleButton = document.getElementById("shuffleButton");
export let flagShuffle = false;
export let trackDataArray = []; //variabili utili per la riproduzione delle tracce nel player, quando seleziono un album
export let indexCurrentTrack = 0;
export let tracks;
let likePlaylist = JSON.parse(localStorage.getItem("likePlaylist")) || [];
const ar = { id: "Preferiti0", namePlaylist: "Preferiti", tracks: [...likePlaylist] };
let playlists = JSON.parse(localStorage.getItem("playlists"));

if (!playlists) {
  playlists = [ar];
  localStorage.setItem("playlists", JSON.stringify(playlists));
}

localStorage.setItem("playlists", JSON.stringify([]));
playlists = JSON.parse(localStorage.getItem("playlists"));
playlists.push(JSON.stringify(likePlaylist));

export function player() {
  const audio = document.getElementById("audio");
  const rangeAudio = document.getElementById("rangeAudio");
  const currentDuration = document.getElementById("currentDuration");
  const maxDuration = document.getElementById("maxDuration");
  const playIcon = document.getElementById("play");
  const resetButton = document.getElementById("resetButton");
  const volumeControl = document.getElementById("volumeControl");
  const loopButton = document.getElementById("loopButton");
  //vado a prendere la durata della canzone
  rangeAudio.value = 0;
  rangeAudio.max = Math.floor(audio.duration);
  maxDuration.innerText = formatTime(audio.duration);

  // va a prendere la durata massima dell'audio
  audio.addEventListener("loadedmetadata", () => {
    rangeAudio.max = Math.floor(audio.duration);
    maxDuration.innerText = formatTime(audio.duration);
  });

  // aggiorna il valore del rangr in base a quello corrente del audio
  audio.addEventListener("timeupdate", () => {
    rangeAudio.value = Math.floor(audio.currentTime);
    currentDuration.innerText = formatTime(audio.currentTime);
  });

  // quando l'input cambia
  rangeAudio.addEventListener("input", () => {
    audio.currentTime = rangeAudio.value;
  });

  // Quando si resetta, finisce, passa a valore zero si resetta
  audio.addEventListener("ended", () => {
    if (tracks.length > 1 && flagLoop === false) {
      playTrack();
    } else {
      rangeAudio.value = 0;
      audio.play();
    }
  });

  document.getElementById("nextTrack").addEventListener("click", () => {
    //evento quando vado alla canzone successiva
    playTrack();
  });

  // Gestore dell'evento click per il pulsante di reset
  resetButton.addEventListener("click", () => {
    audio.currentTime = 0; // Riporta la riproduzione all'inizio
    if (audio.paused) {
      audio.pause(); // Mette in pausa l'audio se è in riproduzione
      playIcon.classList.remove("bi-pause-circle-fill");
      playIcon.classList.add("bi-play-circle-fill");
    }
  });

  // Gestore dell'evento input per il controllo del volume
  volumeControl.addEventListener("input", () => {
    const volumeValue = parseFloat(volumeControl.value);

    // Verifica che il valore sia nell'intervallo [0, 1]
    if (volumeValue < 0 || volumeValue > 1) {
      console.error("Volume value out of range:", volumeValue);
    } else {
      audio.volume = volumeValue;
    }
  });

  // Funzione per formattare il tempo
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function pausePLay() {
    if (audio.paused) {
      audio.play(); // Riproduce l'audio se è in pausa
      playIcon.classList.remove("bi-play-circle-fill");
      playIcon.classList.add("bi-pause-circle-fill");
    } else {
      audio.pause(); // Pausa l'audio se è in riproduzione
      playIcon.classList.remove("bi-pause-circle-fill");
      playIcon.classList.add("bi-play-circle-fill");
    }
  }

  // Gestore di evento per il clic sull'icona di riproduzione
  playIcon.addEventListener("click", () => {
    pausePLay();
  });

  // Definisci la funzione da eseguire quando viene premuto il tasto spazio
  function handleSpacebarPress(event) {
    // Controlla se il tasto premuto è la barra spaziatrice
    if (event.key === " " || event.key === "Spacebar") {
      // Verifica se l'elemento attivo è un input, textarea o select
      const activeElement = document.activeElement;
      const isInputField = activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.tagName === "SELECT";

      if (!isInputField) {
        event.preventDefault(); // Previene il comportamento predefinito (es. scorrimento della pagina)
        pausePLay(); // Esegui la funzione per mettere in pausa o riprodurre
      }
    }
  }

  // Aggiungi l'evento keydown all'intero documento
  document.addEventListener("keydown", handleSpacebarPress);

  shuffleButton.addEventListener("click", () => {
    if (flagShuffle === false) {
      tracks = shuffle(tracks); // Mescola l'array tracks
      shuffleButton.style.color = "#1ED760";
      flagShuffle = true;
    } else {
      flagShuffle = false;
      shuffleButton.style.color = "white";
    }
  });

  loopButton.addEventListener("click", () => {
    if (flagLoop === false) {
      loopButton.style.color = "#1ED760";
      flagLoop = true;
    } else {
      flagLoop = false;
      loopButton.style.color = "white";
    }
  });
}

export function playerCarousel(track) {
  indexCurrentTrack = 0;
  const playIcon = document.getElementById("play"); //vado a mettere il bottone in riproduzione
  playIcon.classList.remove("bi-play-circle-fill");
  playIcon.classList.add("bi-pause-circle-fill");
  const titlePlayer = document.getElementById("titlePlayer"); //vado a prendere gli elementi da cambiare all'interno del player
  const artistPlayer = document.getElementById("artistPlayer");
  const imgPlayer = document.getElementById("imgPlayer");

  const audioElement = document.getElementById("audio"); // Cambia la sorgente dell'audio
  const sourceElement = audioElement.querySelector("source");

  sourceElement.src = track.preview; //imposta il nuovo URL
  titlePlayer.innerText = track.title_short; //cambia nel DOM del player
  artistPlayer.innerText = track.artist.name;
  imgPlayer.src = track.album.cover_small;

  playlistLike(track);

  setTimeout(() => {
    audioElement.load();
    audioElement.play();
  }, 400); // Puoi regolare il tempo di attesa se necessario
}

// Funzione per gestire la riproduzione delle tracce, qui avrò tutte le tracce. Si attiva quando premo l'immagine
export function playerTracks(index) {
  if (flagShuffle === true) {
    tracks = shuffle(tracks); // Mescola l'array tracks
  }
  indexCurrentTrack = 0;
  tracks = trackDataArray[index];
  playTrack();
}

export function playTrack() {
  const playIcon = document.getElementById("play"); //vado a mettere il bottone in riproduzione
  playIcon.classList.remove("bi-play-circle-fill");
  playIcon.classList.add("bi-pause-circle-fill");
  const audioElement = document.getElementById("audio"); // Cambia la sorgente dell'audio

  playPlayTrack();
  // Usa setTimeout per dare tempo al browser di aggiornare la sorgente
  setTimeout(() => {
    audioElement.load();
    audioElement.play();
  }, 600); // Puoi regolare il tempo di attesa se necessario
}

export function playPlayTrack(i) {
  const titlePlayer = document.getElementById("titlePlayer"); //vado a prendere gli elementi da cambiare all'interno del player
  const artistPlayer = document.getElementById("artistPlayer");
  const imgPlayer = document.getElementById("imgPlayer");

  const audioElement = document.getElementById("audio"); // Cambia la sorgente dell'audio
  const sourceElement = audioElement.querySelector("source");

  if (indexCurrentTrack >= tracks.length) {
    indexCurrentTrack = 0; // Resetta l'indice alla prima traccia
  }

  sourceElement.src = tracks[indexCurrentTrack].preview; //imposta il nuvo URL
  titlePlayer.innerText = tracks[indexCurrentTrack].title_short; //cambia nel cose nel DOM del palyer
  artistPlayer.innerText = tracks[indexCurrentTrack].artist.name;
  imgPlayer.src = tracks[indexCurrentTrack].album.cover_small;
  imgPlayer.classList.remove("d-none");
  loader.style.display = "none";

  colorTitleTrack(tracks[indexCurrentTrack].id);
  playlistLike(tracks[indexCurrentTrack]);

  if (i) {
    indexCurrentTrack = 0;
  } else {
    indexCurrentTrack++; //aggiorna l'index per poi andare alla prossima traccia, quando si preme il pulsante
  }
}

//Qui vado a prendere un album. Album iniziale
export function initTracks() {
  albumDataIni("album", "6327742");
}

export function initArtist(artistId) {
  fetchArtist(artistId);
}

export function initLikePlaylist() {
  tracks = likePlaylist;
  playPlayTrack();
}

export function initPlaylist(playlistId) {
  playlists.forEach((el) => {
    if (el.id === playlistId) {
      tracks = el.tracks;
      console.log(tracks);
      playPlayTrack();
      return;
    }
  });
}

export function albumDataIni(type, albumId) {
  //vado a fare una fetch per andare a prendere l'album
  const apiKey = `https://striveschool-api.herokuapp.com/api/deezer/${type}/${albumId}`;

  fetch(apiKey)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("No Album No party");
      }
    })
    .then((dataAlbum) => {
      const audioElement = document.getElementById("audio"); // Cambia la sorgente dell'audio
      const albumtracks = Array.from(dataAlbum.tracks.data);
      tracks = albumtracks;
      playPlayTrack();
      setTimeout(() => {
        audioElement.load();
      }, 600); // Puoi regolare il tempo di attesa se necessario
    })
    .catch((error) => {
      console.error("Errore:", error);
    });
}

//funzione che si attiva quando premo il pulsante della pagina search
export function searchTrack(id) {
  colorTitleTrack(id);
  const playIcon = document.getElementById("play"); //vado a mettere il bottone in riproduzione
  playIcon.classList.remove("bi-play-circle-fill");
  playIcon.classList.add("bi-pause-circle-fill");
  const audioElement = document.getElementById("audio"); // Cambia la sorgente dell'audio
  const i = true;
  indexCurrentTrack = 0;
  albumDataIni("album", id);

  setTimeout(() => {
    audioElement.play();
  }, 1000); // Puoi regolare il tempo di attesa se necessario
}

export function playerAlbumTrack(id) {
  colorTitleTrack(id);

  // Esegui il codice per riprodurre il brano
  tracks.forEach((track, i) => {
    if (track.id === id) {
      playerCarousel(track);
      indexCurrentTrack = i + 1;
    }
  });
}

// Definisci la funzione di mescolamento (Fisher-Yates shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Scambia gli elementi
  }
  return array;
}

function colorTitleTrack(id) {
  // Rimuovi la classe da tutti i titoli
  document.querySelectorAll(".title").forEach((el) => {
    el.classList.remove("selected-title");
  });

  // Trova il titolo del brano selezionato e aggiungi la classe
  const trackElement = document.getElementById(id);
  if (trackElement) {
    const titleElement = trackElement.querySelector(".title");
    if (titleElement) {
      titleElement.classList.add("selected-title");
    }
  }
}

export function playArtistFunction() {
  colorTitleTrack(tracks[0].id);
  playerCarousel(tracks[0]);
}

function fetchArtist(artistId) {
  const keyUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist/";

  fetch(keyUrl + artistId)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("errore");
      }
    })
    .then((singleArtist) => {});
  const keyUrl1 = "/top?limit=11";
  fetch(keyUrl + artistId + keyUrl1)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("errore");
      }
    })
    .then((singleTrack) => {
      const albumtracks = Array.from(singleTrack.data);
      tracks = albumtracks;

      playPlayTrack();
    });
}

function playlistLike(track) {
  const heart = document.getElementById("heart");
  let flagPresentPlayLike = false;
  let idPlayLike = 0;
  likePlaylist.forEach((e) => {
    if (e.id === track.id) {
      //se è presente allora deve essere fill
      heart.classList.remove("bi-heart");
      heart.classList.add("bi-heart-fill");
      flagPresentPlayLike = true;
      idPlayLike = track.id;
      return;
    }
  });

  if (flagPresentPlayLike === false) {
    heart.classList.add("bi-heart");
    heart.classList.remove("bi-heart-fill");
  }

  heart.onclick = function () {
    heart.classList.toggle("bi-heart-fill"); // Cambia l'icona a 'bi-heart-fill'
    heart.classList.toggle("bi-heart"); // Rimuovi l'icona 'bi-heart'

    if (flagPresentPlayLike === false) {
      // Se il brano non è presente in likePlaylist, aggiungilo
      // Aggiungi il brano a likePlaylist
      const newTrack = {
        id: track.id,
        title_short: track.title_short,
        preview: track.preview,
        album: { cover_small: track.album.cover_small },
        duration: track.duration,
        artist: {
          id: track.artist.id,
          name: track.artist.name,
        },
      };
      likePlaylist.push(newTrack);

      // Aggiungi il brano alla prima playlist in playlists (Preferiti)
      playlists[0].tracks.push(newTrack);

      // Aggiorna localStorage per salvare le modifiche
      localStorage.setItem("likePlaylist", JSON.stringify(likePlaylist));
      localStorage.setItem("playlists", JSON.stringify(playlists));
    } else {
      //se è presente allora me lo vai ad elimnare
      const index = likePlaylist.findIndex((item) => item.id === idPlayLike);

      if (index !== -1) {
        console.log("traccia eliminata");
        likePlaylist.splice(index, 1);
        playlists[0].tracks.splice(index, 1);
        // Se l'elemento è trovato, rimuovilo dall'array
      }

      // Aggiorna il localStorage
      localStorage.setItem("likePlaylist", JSON.stringify(likePlaylist));
      localStorage.setItem("playlists", JSON.stringify(playlists));
    }
  };
}
