import { readCookie } from "./cookies.js";

const token = readCookie("SpotifyBearer");
if (!token) {
  location.href = "/index.html";
}

function searchArtistByName(artistName) {
  fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      artistName
    )}&type=artist`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.artists && data.artists.items.length > 0) {
        const venditti = data.artists.items[0];
        console.log("Artista trovato:", venditti);

        getArtistData(venditti.id);
      } else {
        console.log("Artista non trovato.");
      }
    })
    .catch((error) => {
      console.log("Errore nella ricerca dell'artista:", error);
    });
}

function getArtistData(artistId) {
  fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Dati dell'artista:", data);
    })
    .catch((error) => {
      console.log("Errore nella richiesta dell'artista:", error);
    });
}

const artistName = "Antonello Venditti";
searchArtistByName(artistName);

document
  .getElementById("search-toggle")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Controlla se la card esiste già
    const existingCard = document.querySelector(".card-dropdown");
    if (!existingCard) {
      // Creare una nuova card al click
      const card = document.createElement("div");
      card.classList.add("card-dropdown");

      // Aggiunge il contenuto della card (opzioni di ricerca)
      card.innerHTML = `
      <div class="card-dropdown-item" id="search-album">Album</div>
      <div class="card-dropdown-item" id="search-song">Canzoni</div>
      <div class="card-dropdown-item" id="search-artist">Autori</div>
    `;

      // Aggiunge la card al body
      document.body.appendChild(card);

      // Posiziona sotto il pulsante "Cerca"
      const rect = this.getBoundingClientRect();
      card.style.top = `${rect.bottom}px`;
      card.style.left = `${rect.left}px`;

      // Mostra la card
      card.style.display = "block";

      // Chiude la card quando si clicca fuori
      window.addEventListener("click", function (e) {
        if (
          !card.contains(e.target) &&
          e.target !== document.getElementById("search-toggle")
        ) {
          card.remove();
        }
      });

      // Eventi click sulle opzioni
      document
        .getElementById("search-album")
        .addEventListener("click", function () {
          console.log("Ricerca Album");
        });

      document
        .getElementById("search-song")
        .addEventListener("click", function () {
          console.log("Ricerca Canzoni");
        });

      document
        .getElementById("search-artist")
        .addEventListener("click", function () {
          console.log("Ricerca Autori");
        });
    }
  });
