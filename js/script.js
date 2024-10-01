import { clientId, clientSecret, redirectUri, scope, apiUrlToken, authUrlBase } from "./constants.js";

function redirectToSpotifyLogin() {
  const authUrl = `${authUrlBase}?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.log("Auth URL:", authUrl);
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
        console.log(data);
        if (data.access_token) {
          console.log(writeCookie("SpotifyBearer", data.access_token));
          console.log("Access token:", data.access_token);

          window.location.href = "./home.html";
        } else {
          console.log("Errore nel recupero del token:", data);
        }
      })
      .catch((error) => {
        console.log("Errore durante la richiesta del token:", error);
      });
  }
}

function writeCookie(nomecookie, valore) {
  let now = new Date();
  now.setHours(now.getHours() + 1);
  const cookieString = `${nomecookie}=${valore}; expires=${now.toUTCString()}; path=/`;
  document.cookie = cookieString;
  console.log("Cookie scritto:", cookieString);
  return cookieString;
}
console.log(writeCookie("BearerToken"));

// redirectToSpotifyLogin();
handleSpotifyCallback();
