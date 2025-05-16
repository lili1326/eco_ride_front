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

    const participerBtn = document.getElementById("participer-btn");

if (participerBtn) {
  participerBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:8000/api/participate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token
        },
        body: JSON.stringify({ ride_id: id })
      });

       if (!res.ok) {
  const error = await res.json();

  if (res.status === 409 && error.error === "Déjà inscrit") {
    alert(" Vous êtes déjà inscrit à ce trajet !");
  } else if (res.status === 401) {
    alert(" Vous devez être connecté.");
    window.location.href = "/signin";
  } else {
    alert(" Une erreur est survenue lors de la participation.");
  }

  return; // stop la suite (ne redirige pas)
}

      alert("Participation enregistrée !");
       window.history.pushState({}, "", "/passager");
window.dispatchEvent(new PopStateEvent("popstate"));;  
    } catch (error) {
      console.error("Erreur participation :", error);
      alert("Impossible de participer à ce trajet.");
    }
  });

}


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
const prefActive = localStorage.getItem("preference_active");

if (prefActive) {
  const p = JSON.parse(prefActive);
  prefList.innerHTML = `
    <p>Fumeur : ${p.fumeur}</p>
    <p>Animaux : ${p.animaux}</p>
    <p>Musique : ${p.musique}</p>
    <p>Description : ${p.description}</p>
  `;
} else {
  prefList.textContent = "Aucune préférence active.";
}

} catch (err) {
    console.error(" Erreur :", err);
    const detail = document.getElementById("detail-trajet");
    if (detail) detail.innerHTML = " Erreur de chargement.";
  }
})();



//------------AVIS------------------------

 (async () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const token = getToken();

  if (!id || !token) return;

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

     

     
    afficherAvisDuConducteur(ride.conducteur.id);

  } catch (err) {
    console.error("Erreur :", err);
  }
})();  

async function afficherAvisDuConducteur(conducteurId) {
  const token = getToken();
  const container = document.getElementById("avis-recus-container");

  if (!token || !container) return;

  container.innerHTML = "<p>Chargement des avis...</p>";

  try {
    const res = await fetch(`http://localhost:8000/api/review/conducteur/${conducteurId}`, {
      headers: { "X-AUTH-TOKEN": token }
    });

    if (!res.ok) {
      const msg = await res.text();
      console.error("Erreur chargement avis :", msg);
      container.innerHTML = "<p>Erreur chargement des avis.</p>";
      return;
    }

    const avis = await res.json();

    if (!avis.length) {
      container.innerHTML = "<p>Aucun avis trouvé pour ce conducteur.</p>";
      return;
    }

    container.innerHTML = "";

    avis.forEach(a => {
      const date = new Date(a.createdAt).toLocaleDateString("fr-FR");
      const trajet = `${a.covoiturage?.lieu_depart || "?"} → ${a.covoiturage?.lieu_arrivee || "?"}`;

      const bloc = document.createElement("p");
      bloc.innerHTML = `
        <strong>Date :</strong> ${date} — <strong>Note :</strong> ${a.note}/5<br>
        <strong>Trajet :</strong> ${trajet}<br>
        <strong>Commentaire :</strong> ${a.commentaire}<br>
        <strong>Passager :</strong> ${a.auteur?.firstName ?? "Inconnu"}<br><br>
      `;
      container.appendChild(bloc);
    });
  } catch (err) {
    console.error("Erreur réseau :", err);
    container.innerHTML = "<p>Erreur réseau.</p>";
  }
}


