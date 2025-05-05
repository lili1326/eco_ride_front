import { getToken } from "./auth/auth.js";


console.log("✅ Script conducteur.js chargé");

// 🔐 Fonction pour récupérer le token depuis localStorage
 

setTimeout(() => {
  const form = document.getElementById("form-trajet");

  if (!form) {
    console.warn("❌ Formulaire 'form-trajet' introuvable.");
    return;
  }

  console.log("✅ Formulaire détecté");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert("❌ Utilisateur non authentifié.");
      return;
    }

    console.log("📤 Soumission interceptée");

    const horaire = form.horaire.value.trim(); // ex: 08h00/10h30
    const [departTime, arriveeTime] = horaire
      .split("/")
      .map((h) => h.replace("h", ":") + ":00");

    const data = {
      lieu_depart: form.depart.value,
      lieu_arrivee: form.arrivee.value,
      date_depart: form.date.value,
      heure_depart: departTime,
      heure_arrivee: arriveeTime,
      nb_place: parseInt(form.places.value),
      prix_personne: parseFloat(form.prix.value),
      energie: form.energie.value
    };

    console.log("📦 Données à envoyer :", data);

    try {
      const response = await fetch("http://localhost:8000/api/ride", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token
        },
        body: JSON.stringify(data)
      });
      const result = await response.json(); // ✅ Lire d'abord le JSON
      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Erreur backend :", text);
        alert("❌ Erreur lors de la création du trajet.");
        return;
      }

      alert("✅ Trajet bien enregistré !");
  //    const location = response.headers.get("Location");
 
     

   //   if (!location) {
   //     alert("❌ Impossible de récupérer l'URL du trajet.");
   //     return;
   //   }

   //   const getResponse = await fetch(location, {
    //    headers: { "X-AUTH-TOKEN": token }
    //  });
     // const ride = await getResponse.json();
     const ride = result;

      const recap = document.getElementById("recap-trajet");
      recap.innerHTML = `
        <h4>📝 Récapitulatif du trajet proposé :</h4>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Départ :</strong> ${ride.lieu_depart} à ${ride.heure_depart.slice(0, 5)}</li>
          <li><strong>Arrivée :</strong> ${ride.lieu_arrivee} à ${ride.heure_arrivee.slice(0, 5)}</li>
          <li><strong>Date :</strong> ${ride.date_depart}</li>
          <li><strong>Places disponibles :</strong> ${ride.nb_place}</li>
          <li><strong>Prix / personne :</strong> ${ride.prix_personne} €</li>
          <li><strong>Énergie :</strong> ${ride.energie}</li>
        </ul>
      `;

      form.reset();
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
      alert("❌ Erreur réseau ou serveur.");
    }
  });
}, 500);
