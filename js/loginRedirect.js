import { clientId, redirectUri, scope, authUrlBase } from "./constants.js";

function redirectToSpotifyLogin() {
  const authUrl = `${authUrlBase}?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.log("Auth URL:", authUrl);
  window.location.href = authUrl;
}

redirectToSpotifyLogin();