
import { getToken } from "./auth/auth.js";

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-details")) {
    const id = e.target.dataset.id;
    const token = getToken();

    if (!token) {
      alert(" Vous devez être connecté pour voir les détails.");
      window.location.href = "/signin"; // redirige vers la page de login
      return;
    }

    // Redirige vers la vue détaillée si connecté
    window.history.pushState({}, "", `/vueDetaileeCovoiturage?id=${id}`);
    window.dispatchEvent(new PopStateEvent("popstate")); // recharge dynamiquement via routeur
  }
});




console.log(" covoiturage.js chargé");
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

    const url = new URL("http://localhost:8000/api/ride/public/rides");
    if (depart) url.searchParams.append("depart", depart);
    if (arrivee) url.searchParams.append("arrivee", arrivee);
    if (date) url.searchParams.append("date", date);
  
    try {
      const res = await fetch(url);
  
      //  Ajoute cette ligne pour debug si erreur
      const text = await res.text();
      console.log("Contenu brut reçu :", text);
  
      //  Repars du texte brut pour parser le JSON
      const rides = JSON.parse(text);
  
      const list = document.querySelector("#listCovoiturage .containerList");
      list.innerHTML = "";
  
      if (rides.length === 0) {
        document.getElementById("messageTrajet").textContent = " Aucun trajet trouvé.";
        return;
      }



      
        // Afficher les sections si résultats
    filterContainer.style.display = "block";
    resultsContainer.style.display = "block";
  
      document.getElementById("messageTrajet").textContent = "";
  
      rides.forEach(ride => {
        const d = new Date(ride.date_depart);
        const dateStr = d.toLocaleDateString("fr-FR");
  
        const heureDep = new Date(ride.heure_depart).toTimeString().slice(0, 5);
        const heureArr = new Date(ride.heure_arrivee).toTimeString().slice(0, 5);
  
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="profile">
            <h3>${ride.conducteur?.pseudo || "Conducteur"}</h3>
            <img src="/assets/images/avatar.png" width="70px" alt="Avatar">
          </div>
          <p>${ride.lieu_depart} → ${ride.lieu_arrivee}</p>
          <p>Place: ${ride.nb_place}</p>
          <p>Prix: ${ride.prix_personne} €</p>
          <p>Date: ${dateStr}</p>
          <p>Horaire: ${heureDep} / ${heureArr}</p>
          <p>Véhicule ${ride.energie}</p>
           <button class="btn-details" data-id="${ride.id}">Voir les détails</button>
        `;
        list.appendChild(card);
      });
 

    } catch (err) {
      console.error(" Erreur lors de la recherche :", err);
      document.getElementById("messageTrajet").textContent = "Erreur lors de la recherche.";
    }
  });

 

 
