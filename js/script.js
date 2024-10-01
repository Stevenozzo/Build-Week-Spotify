import { clientId, clientSecret, redirectUri, scope, apiUrlToken, authUrlBase } from "./constants.js";

function redirectToSpotifyLogin() {
  const authUrl = `${authUrlBase}?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.log(authUrl);
  window.location.href = authUrl;
}

function handleSpotifyCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    const bodyParams = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    });

    fetch(apiUrlToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
      },
      body: bodyParams,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          writeCookie("SpotifyBearer", data.access_token);
          console.log("Access token:", data.access_token);

          window.history.pushState({}, document.title, redirectUri);
        } else {
          console.error("Errore nel recupero del token:", data);
        }
      })
      .catch((error) => {
        console.error("Errore durante la richiesta del token:", error);
      });
  }
}

function writeCookie(nomecookie, valore) {
  let now = new Date();
  now.setHours(now.getHours() + 1);
  document.cookie = `${nomecookie}=${valore}; expires=${now.toUTCString()}; path=/`;
}

function readCookie(nomecookie) {
  let cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key.trim() === nomecookie) {
      return value;
    }
  }
  return null;
}

redirectToSpotifyLogin();
handleSpotifyCallback();

const vendittiId = "3hYLJPJuDyblFKersEaFd6";

function getArtistData() {
  const token = readCookie("SpotifyBearer");
  if (!token) {
    console.error("Token non trovato!");
    return;
  }

  fetch(`https://api.spotify.com/v1/artists/${vendittiId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Artista:", data);
    })
    .catch((error) => {
      console.error("Errore nella richiesta dell'artista:", error);
    });
}

getArtistData();
