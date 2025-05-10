import { getToken } from "./auth/auth.js";

console.log(" profil.js chargé");

setTimeout(() => {
  const pseudoEl = document.getElementById("pseudo-info");
  const prenomEl = document.getElementById("prenom-info");
  const welcome = document.getElementById("welcome-message");

  if (!pseudoEl || !prenomEl || !welcome) {
    console.warn(" Les éléments HTML de profil ne sont pas encore disponibles.");
    return;
  }

  const token = getToken();
  if (!token) {
    console.warn(" Aucun token trouvé. L'utilisateur n'est peut-être pas connecté.");
    return;
  }

  fetch("http://localhost:8000/api/account/me", {
    headers: {
      "X-AUTH-TOKEN": token
    }
  })
    .then(res => res.json())
    .then(user => {
      console.log("🔍 Utilisateur reçu :", user);
      prenomEl.textContent = user.firstName || "inconnu";
      pseudoEl.textContent = user.pseudo || "inconnu";
      welcome.textContent = `Bonjour ${user.firstName}, bienvenue sur votre page personnelle !`;
    })
    .catch(err => {
      console.error(" Erreur lors du chargement des infos utilisateur :", err);
    });

}, 300); // Laisse le temps au DOM de se charger via le routeur
