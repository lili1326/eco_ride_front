import { getToken } from "./auth/auth.js";

console.log(" Script vueDetaileeCovoiturage.js chargé");

(async () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const token = getToken();

  if (!id || !token) {
    if (!id) alert(" ID manquant");
    if (!token) {
      alert(" Vous devez être connecté pour accéder aux détails.");
      window.location.href = "/signin";
    }
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/api/ride/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);


    const ride = await res.json();
    console.log(" Trajet :", ride);

  //INFO UESR CONDUCTEUR 
     document.getElementById("conducteur-nom").textContent = ride.conducteur?.pseudo || "Conducteur inconnu";

//INFO TRAJET

    const t = document.getElementById("trajet");
    const p = document.getElementById("places");
    const pr = document.getElementById("prix");
    const d = document.getElementById("date");
    const h = document.getElementById("horaire");

    if (t) t.textContent = `${ride.lieu_depart} → ${ride.lieu_arrivee}`;
    if (p) p.textContent = `Places disponibles : ${ride.nb_place}`;
    if (pr) pr.textContent = `Prix par personne : ${ride.prix_personne} €`;
    if (d) d.textContent = `Date : ${new Date(ride.date_depart).toLocaleDateString("fr-FR")}`;
    if (h) h.textContent = `Heure : ${new Date(ride.heure_depart).toTimeString().slice(0, 5)} → ${new Date(ride.heure_arrivee).toTimeString().slice(0, 5)}`;
  

//  INFOS VOITURE

document.getElementById("car-marque").textContent = ride.voiture?.marque || "Inconnue";
document.getElementById("car-modele").textContent = ride.voiture?.modele || "Inconnu";
document.getElementById("car-energie").textContent = ride.voiture?.energie || "Inconnue";

//  PRÉFÉRENCES CONDUCTEUR
const prefList = document.getElementById("preferences-list");
if (ride.conducteur?.preferences?.length > 0) {
  prefList.innerHTML = ride.conducteur.preferences
    .map(p => `• ${p.description}`)
    .join("<br>");
} else {
  prefList.textContent = "Aucune préférence renseignée.";
}

} catch (err) {
    console.error(" Erreur :", err);
    const detail = document.getElementById("detail-trajet");
    if (detail) detail.innerHTML = " Erreur de chargement.";
  }
})();
