import { getToken } from "./auth/auth.js";
import { API_URL } from "./config.js";

/* ====== État des filtres ====== */
const currentFilters = {
  energie: "",
  prixMax: "",
  dureeMax: "",
  noteMin: ""
};

/* ====== Menus déroulants -> maj des filtres ====== */
document.addEventListener("click", (e) => {
  const item = e.target.closest(".dropdown-item");
  if (!item) return;

  e.preventDefault(); // évite le # qui remonte en haut de page
  const key = item.dataset.filter;
  const value = item.dataset.value ?? "";
  if (key) currentFilters[key] = value;
  // console.log("Filtres ->", currentFilters);
});

/* ====== Navigation détails ====== */
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-details")) return;

  const id = e.target.dataset.id;
  const token = getToken();
  if (!token) {
    alert(" Vous devez être connecté pour voir les détails.");
    window.location.href = "/signin";
    return;
  }
  window.history.pushState({}, "", `/vueDetaileeCovoiturage?id=${id}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
});

/* ====== Pré-remplissage ====== */
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
    setTimeout(() => tryFillInputsFromURL(attempt + 1), 100);
  } else {
    console.warn(" Inputs toujours indisponibles après 1s");
  }
}
setTimeout(tryFillInputsFromURL, 200);

/* ====== Recherche (une seule fonction) ====== */
async function searchRides() {
  const depart = document.getElementById("depart").value;
  const arrivee = document.getElementById("arrivee").value;
  const date = document.getElementById("date").value;

  const filterContainer = document.querySelector(".filter-container");
  const resultsContainer = document.querySelector(".listecovoiturage");

  if (filterContainer) filterContainer.style.display = "none";
  if (resultsContainer) resultsContainer.style.display = "none";

  const url = new URL(`${API_URL}/api/ride/public/rides`);
  if (depart) url.searchParams.append("depart", depart);
  if (arrivee) url.searchParams.append("arrivee", arrivee);
  if (date) url.searchParams.append("date", date);

  // nouveaux filtres
  if (currentFilters.energie) url.searchParams.append("energie", currentFilters.energie);
  if (currentFilters.prixMax) url.searchParams.append("prixMax", currentFilters.prixMax);
  if (currentFilters.dureeMax) url.searchParams.append("dureeMax", currentFilters.dureeMax);
  if (currentFilters.noteMin) url.searchParams.append("noteMin", currentFilters.noteMin);

  try {
    const res = await fetch(url);
    const text = await res.text();
    const rides = JSON.parse(text);

    const list = document.querySelector("#listCovoiturage .containerList");
    if (list) list.innerHTML = "";

    if (!Array.isArray(rides) || rides.length === 0) {
      document.getElementById("messageTrajet").textContent = " Aucun trajet trouvé.";
      return;
    }

    if (filterContainer) filterContainer.style.display = "block";
    if (resultsContainer) resultsContainer.style.display = "block";
    document.getElementById("messageTrajet").textContent = "";

    rides.forEach((ride) => {
      const d = new Date(ride.date_depart);
      const dateStr = d.toLocaleDateString("fr-FR");
      const heureDep = new Date(ride.heure_depart).toTimeString().slice(0, 5);
      const heureArr = new Date(ride.heure_arrivee).toTimeString().slice(0, 5);

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="profile">
          <h3>${ride.conducteur?.pseudo || "Conducteur"}</h3>
          <p class="note-conducteur">Note conducteur : ${localStorage.getItem("note_moyenne_conducteur") || "Non noté"}</p>
          <img src="/assets/images/avatar.png" width="70" alt="Avatar">
        </div>
        <p>${ride.lieu_depart} → ${ride.lieu_arrivee}</p>
        <p>Place: ${ride.nb_place}</p>
        <p>Prix: ${ride.prix_personne} €</p>
        <p>Date: ${dateStr}</p>
        <p>Horaire: ${heureDep} / ${heureArr}</p>
        <p>Véhicule ${ride.voiture.energie}</p>
        <button class="btn-details" data-id="${ride.id}">Voir les détails</button>
      `;
      if (list) list.appendChild(card);
    });
  } catch (err) {
    console.error("Erreur lors de la recherche :", err);
    document.getElementById("messageTrajet").textContent = "Erreur lors de la recherche.";
  }
}

/* ====== Boutons ====== */
document.getElementById("btn-recherche").addEventListener("click", searchRides);
const btnFilter = document.querySelector(".search-button-filter");
if (btnFilter) btnFilter.addEventListener("click", searchRides);
