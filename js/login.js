import { clientId, scope, redirectUri } from "./modules/constants.js";

const authEndpoint = 'https://accounts.spotify.com/authorize';
const params = new URLSearchParams({
  response_type: 'code',
  client_id: clientId,
  scope: scope,
  redirect_uri: redirectUri,
});

const authorizationUrl = `${authEndpoint}?${params.toString()}`;

window.location.href = authorizationUrl;
