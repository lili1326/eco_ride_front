
import { getToken } from "./auth/auth.js";
import { API_URL } from "./config.js";

// Écouteur d'événement : on attend un clic
document.addEventListener("click", (e) => {

// Vérifie si l'élément cliqué contient la classe "btn-details"
  if (e.target.classList.contains("btn-details")) {

   // Récupère l'ID associé à l'élément (via un attribut data-id dans le HTML)
    const id = e.target.dataset.id;

 // Récupère un jeton d'authentification 
    const token = getToken();

// Si l'utilisateur n'est pas connecté (pas de token), on l'alerte et on le redirige vers la page de connexion
    if (!token) {
      alert(" Vous devez être connecté pour voir les détails.");
      window.location.href = "/signin"; // Redirection vers la page de connexion
      return; // On arrête l'exécution ici
    }
// Si l'utilisateur est connecté :
// Change l'URL affichée dans le navigateur sans recharger la page
    window.history.pushState({}, "", `/vueDetaileeCovoiturage?id=${id}`);
    window.dispatchEvent(new PopStateEvent("popstate")); // recharge dynamiquement via routeur
  }
});




//console.log(" covoiturage.js chargé");
function tryFillInputsFromURL(attempt = 0) {
    const departInput = document.getElementById("depart");
    const arriveeInput = document.getElementById("arrivee");
    const dateInput = document.getElementById("date");
    const btnRecherche = document.getElementById("btn-recherche");
  
    if (departInput && arriveeInput && dateInput && btnRecherche) {
      const urlParams = new URLSearchParams(window.location.search);
      const depart = urlParams.get("depart");
      const arrivee = urlParams.get("arrivee");
      const date = urlParams.get("date");
  
      if (depart) departInput.value = depart;
      if (arrivee) arriveeInput.value = arrivee;
      if (date) dateInput.value = date;
  
       
    } else if (attempt < 10) {
      // Essaye à nouveau dans 100ms (max 10 fois = 1s)
      setTimeout(() => tryFillInputsFromURL(attempt + 1), 100);
    } else {
      console.warn(" Inputs toujours indisponibles après 1s");
    }
  }
  
  // Lancer après DOMContentLoaded
  // Attendre que le DOM ait bien été injecté dans #main-page (ex. via le routeur)
setTimeout(() => {
    tryFillInputsFromURL();
  }, 200); // ← délai suffisant pour que #main-page contienne le bon HTML
 
 
  


document.getElementById("btn-recherche").addEventListener("click", async () => {
    const depart = document.getElementById("depart").value;
    const arrivee = document.getElementById("arrivee").value;
    const date = document.getElementById("date").value;
  
 // Cibler les blocs à afficher/masquer
 const filterContainer = document.querySelector(".filter-container");
 const resultsContainer = document.querySelector(".listecovoiturage");

 // Masquer les sections avant la recherche
 filterContainer.style.display = "none";
 resultsContainer.style.display = "none";

    const url = new URL( `${API_URL}/api/ride/public/rides`);
// Ajout dynamique des paramètres dans l’URL
    if (depart) url.searchParams.append("depart", depart);
    if (arrivee) url.searchParams.append("arrivee", arrivee);
    if (date) url.searchParams.append("date", date);
  
    try {
  // appel à l’API
      const res = await fetch(url);
  
  // Récupération du corps brut de la réponse
      const text = await res.text();
      //console.log("Contenu brut reçu :", text);
  
  // Conversion du texte JSON en tableau d’objets JavaScript
      const rides = JSON.parse(text);

  // Sélection du conteneur HTML où les résultats seront affichés
      const list = document.querySelector("#listCovoiturage .containerList");
      list.innerHTML = "";
  // Si aucun trajet trouvé, on affiche un message informatif à l’utilisateur 
      if (rides.length === 0) {
        document.getElementById("messageTrajet").textContent = " Aucun trajet trouvé.";
        return;
      }

 


      
        // Afficher les sections si résultats
    filterContainer.style.display = "block";
    resultsContainer.style.display = "block";
  
      document.getElementById("messageTrajet").textContent = "";

  // Parcourt chaque élément du tableau "rides"
      rides.forEach(ride => {
        const d = new Date(ride.date_depart);
        const dateStr = d.toLocaleDateString("fr-FR");
  
        const heureDep = new Date(ride.heure_depart).toTimeString().slice(0, 5);
        const heureArr = new Date(ride.heure_arrivee).toTimeString().slice(0, 5);

  // Crée un élément <div> pour représenter une carte de covoiturage
        const card = document.createElement("div");

  // Attribue la classe CSS "card" à l'élément créé pour le styliser
        card.className = "card";

  // Remplit le contenu HTML de la carte avec les informations du trajet
        card.innerHTML = `
          <div class="profile">
            <h3>${ride.conducteur?.pseudo || "Conducteur"}</h3>
            <p class="note-conducteur">Note conducteur : ${
                 localStorage.getItem("note_moyenne_conducteur") || "Non noté"
}           </p>
            <img src="/assets/images/avatar.png" width="70px" alt="Avatar">
          </div>
          <p>${ride.lieu_depart} → ${ride.lieu_arrivee}</p>
          <p>Place: ${ride.nb_place}</p>
          <p>Prix: ${ride.prix_personne} €</p>
          <p>Date: ${dateStr}</p>
          <p>Horaire: ${heureDep} / ${heureArr}</p>
          <p>Véhicule ${ride.voiture.energie}</p>
           <button class="btn-details" data-id="${ride.id}">Voir les détails</button>
        `;
        list.appendChild(card);
        
      });
 

    } catch (err) {
      console.error(" Erreur lors de la recherche :", err);
      document.getElementById("messageTrajet").textContent = "Erreur lors de la recherche.";
    }
  });

 

 
 