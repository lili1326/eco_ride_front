 // config.js
 const host = window.location.hostname;

export const API_URL = host.includes("localhost") || host === "127.0.0.1"
  ? "http://localhost:8000"
  : "https://eco-ride-back-d7c8f5e4a3e6.herokuapp.com";