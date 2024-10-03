import { apiUrlToken, clientSecret, clientId } from "../../js/constants.js";

export function getToken() {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      //   data.access_token;
      exportToken(data.access_token);
    });
}
const exportToken = (token) => {
  localStorage.setItem("tempToken", token);
};

// const vendittiId = "3hYLJPJuDyblFKersEaFd6";

// const apiUrlArtist = https://api.spotify.com/v1/artists/${vendittiId};

// fetch(apiUrlArtist, {
//   method: "GET",
//   headers: {
//     Authorization: "Bearer " + apiKeyTemp,
//   },
// })
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok: " + response.statusText);
//     }
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error("Errore:", error);
//   });
