export const clientId = "5822df7e876743069edcf2cd2a9529ea";
export const clientSecret = "f7025997d0c1426eaaefd8e07bd3b813";
export const redirectUri = "http://127.0.0.1:5501/auth.html";
export const scope = [
  "user-read-private",
  "user-read-playback-state",
  "user-read-email",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "playlist-modify-public",
  "playlist-modify-private",
  "app-remote-control",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
  "user-library-modify",
].join(" ");

console.log(scope);

export const apiUrlToken = "https://accounts.spotify.com/api/token";
export const authUrlBase = "https://accounts.spotify.com/authorize";
