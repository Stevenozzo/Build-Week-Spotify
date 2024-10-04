import getToken from './modules/getToken.js'

const urlParams = new URLSearchParams(location.search);
const code = urlParams.get('code');

if (code) {
  // ho ricevuto il codice e lo scambio con il token
  getToken(code)
  .then(()=>{
    //fine, ti mando alla home
    location.href = './home.html'
  })
} else {
  // eventuale mancanza del codice
}