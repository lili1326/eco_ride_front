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
      const noteMoyenneEl = document.getElementById("note-moyenne");
if (noteMoyenneEl) {
  fetch(`http://localhost:8000/api/review/conducteur/${user.id}/moyenne`, {
    headers: {
      "X-AUTH-TOKEN": token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erreur de réponse " + res.status);
      return res.json();
    })
    .then(data => {
      const note = data.note_moyenne !== null ? data.note_moyenne.toFixed(1) : "Non noté";
      noteMoyenneEl.textContent = `Note moyenne conducteur : ${note}`;
    })
    .catch(err => {
      console.error("Erreur lors de la récupération de la note moyenne :", err);
      noteMoyenneEl.textContent = "Note moyenne : indisponible";
    });
}
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

}, 

300);


 