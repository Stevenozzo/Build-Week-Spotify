const tokena = localStorage.getItem("access_token");

export function transferPlayback(deviceId, token = tokena) {
  fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: false, // true per iniziare subito la riproduzione
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Riproduzione trasferita con successo!");
      } else {
        prova500([deviceId]);
        throw new Error("Errore nel trasferimento della riproduzione");
      }
    })
    .catch((error) => {
      console.error("Errore nella richiesta:", error);
    });
}

export function playSong(spotifyUri) {
  const token = localStorage.getItem("access_token");

  fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: "PUT",
    body: JSON.stringify({ uris: [spotifyUri] }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.ok) {
      console.log("Brano in riproduzione!");
    } else {
      console.error("Errore nella riproduzione del brano:", response);
    }
  });
}

export function pauseSong() {
  const token = localStorage.getItem("access_token");
  fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.ok) {
      console.log("Riproduzione in pausa!");
    } else {
      console.error("Errore durante la messa in pausa:", response);
    }
  });
}

const prova500 = (deviceId) => {
  fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokena}`,
    },
    body: JSON.stringify({
      device_ids: deviceId, // Metti deviceId all'interno di un array
      play: false,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // Se la risposta non è OK, lancia un errore con lo stato e il testo
        return response.json().then((data) => {
          console.error(`Errore ${response.status}:`, data);
          throw new Error("Errore nella risposta dal server");
        });
      }
      // Se la risposta è ok, restituisci i dati in JSON
      return response.json();
    })
    .then((data) => {
      console.log("Richiesta avvenuta con successo:", data);
    })
    .catch((error) => {
      console.error("Errore nella richiesta:", error);
    });
};
