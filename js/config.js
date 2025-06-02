 // config.js


 const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API_URL = isLocalhost
  ? "http://localhost:8000"
  : "https://eco-ride-back-d7c8f5e4a3e6.herokuapp.com"; 
  console.log("API_URL utilisée :", API_URL);
console.log("hostname détecté :", window.location.hostname);
console.log("Origin vue par le navigateur :", window.origin);