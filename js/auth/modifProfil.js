 import { getToken } from "../auth/auth.js";
import { API_URL } from "../config.js";

console.log("modifProfil.js chargé");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("edit-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // 1️⃣ Récupération des valeurs saisies dans le formulaire
    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim(); // facultatif

    // 2️⃣ Création de l'objet à envoyer au backend
    const updatedUser = { firstName, email };
    if (password !== "") {
      updatedUser.password = password;
    }

    try {
      // 3️⃣ Envoi de la requête PUT vers l'API
      const response = await fetch(`${API_URL}/api/account/edit`, {
        method: "PUT",
        headers: {
          "X-AUTH-TOKEN": getToken(), // Authentification avec le token
        },
        body: JSON.stringify(updatedUser),
      });

      // 4️⃣ Traitement de la réponse
      if (response.ok) {
        alert("✅ Modifications enregistrées !");
        window.location.href = "/account"; // Redirection vers la page profil
      } else if (response.status === 401) {
        alert(" Vous devez être connecté pour modifier vos infos.");
      } else {
        alert(" Erreur lors de la mise à jour. Veuillez vérifier vos champs.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert(" Erreur de connexion au serveur.");
    }
  });
});
