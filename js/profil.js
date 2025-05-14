import { getToken } from "./auth/auth.js";

console.log("profil.js chargé");

setTimeout(() => {
  const pseudoEl = document.getElementById("pseudo-info");
  const prenomEl = document.getElementById("prenom-info");
  const welcome = document.getElementById("welcome-message");
  const soldeEl = document.getElementById("solde-info"); // 🔹 Assure-toi que cet ID existe dans ton HTML

  if (!pseudoEl || !prenomEl || !welcome) {
    console.warn("Les éléments HTML de profil ne sont pas encore disponibles.");
    return;
  }

  const token = getToken();
  if (!token) {
    console.warn("Aucun token trouvé. L'utilisateur n'est peut-être pas connecté.");
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

      //  On récupère maintenant le solde
      if (soldeEl) {
        fetch("http://localhost:8000/api/wallet", {
          headers: {
            "X-AUTH-TOKEN": token
          }
        })
          .then(res => res.json())
          .then(wallet => {
            soldeEl.textContent = `Votre solde de crédits est de ${wallet.solde} €`;
          })
          .catch(err => {
            console.error("Erreur lors de la récupération du wallet :", err);
            soldeEl.textContent = `Solde indisponible`;
          });
      }
    })
    .catch(err => {
      console.error("Erreur lors du chargement des infos utilisateur :", err);
    });

}, 300);
 