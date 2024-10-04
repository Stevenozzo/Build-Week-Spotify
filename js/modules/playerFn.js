export function transferPlayback(deviceId, token) {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false, // true per iniziare subito la riproduzione
      }),
    }).then(response => {
      if (response.ok) {
        console.log('Riproduzione trasferita con successo!');
      } else {
        console.error('Errore nel trasferimento della riproduzione:', response);
      }
    });
  }

export function playSong(spotifyUri) {
  const token = localStorage.getItem('access_token');
  
    fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotifyUri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).then(response => {
      if (response.ok) {
        console.log('Brano in riproduzione!');
      } else {
        console.error('Errore nella riproduzione del brano:', response);
      }
    });
  }

  export function pauseSong() {
    const token = localStorage.getItem('access_token');
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).then(response => {
      if (response.ok) {
        console.log('Riproduzione in pausa!');
      } else {
        console.error('Errore durante la messa in pausa:', response);
      }
    });
  }
  
  
  
  