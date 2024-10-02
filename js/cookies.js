export function readCookie(nomecookie) {
    let cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      let [key, value] = cookie.split("=");
      if (key.trim() === nomecookie) {
        return value;
      }
    }
    return null;
  }
  

export function writeCookie(nomecookie, valore) {
    let now = new Date();
    now.setHours(now.getHours() + 1);
    const cookieString = `${nomecookie}=${valore}; expires=${now.toUTCString()}; path=/`;
    document.cookie = cookieString;
    console.log("Cookie scritto:", cookieString);
    return cookieString;
}