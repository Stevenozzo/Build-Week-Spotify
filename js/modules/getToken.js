import { redirectUri, clientId, clientSecret } from "./constants.js";

export default async function getToken(code) {
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (data.access_token) {
      const accessToken = data.access_token;
      // const refreshToken = data.refresh_token;

      localStorage.setItem('access_token', accessToken);
      // localStorage.setItem('refresh_token', refreshToken);
    } else {
      console.error('Errore nell\'ottenimento del token:', data);
    }
  } catch (error) {
    console.error('Errore nella richiesta del token:', error);
  }
}
