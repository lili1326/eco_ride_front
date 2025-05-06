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

// 👉 Ecouteur de clic pour voir les trajets
document.addEventListener("DOMContentLoaded", () => {
    const btnVoir = document.getElementById("btn-mes-trajets");
    if (btnVoir) {
      btnVoir.addEventListener("click", afficherMesTrajets);
    }
  });



// AFFICHER MES TRAJETS

async function afficherMesTrajets() {
    const token = getToken();
  
    try {
        const response = await fetch("http://localhost:8000/api/ride/mes-trajets", {
            headers: {
                "Content-Type": "application/json",
              "X-AUTH-TOKEN": token
            }
          });
  
      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Erreur en récupérant les trajets :", text);
        alert("❌ Impossible de récupérer les trajets.");
        return;
      }
  
      const trajets = await response.json();
      const recap = document.getElementById("recap-trajet");
  
      if (!trajets.length) {
        recap.innerHTML = "<p>🚫 Aucun trajet enregistré.</p>";
        return;
      }
  
      recap.innerHTML = "<h4>📝 Mes trajets</h4>";
  
      trajets.forEach(ride => {
        const trajetDiv = document.createElement("div");
        trajetDiv.setAttribute("data-id", ride.id);
trajetDiv.setAttribute("data-lieu_depart", ride.lieu_depart);
trajetDiv.setAttribute("data-lieu_arrivee", ride.lieu_arrivee);
trajetDiv.setAttribute("data-date_depart", ride.date_depart);
trajetDiv.setAttribute("data-heure_depart", ride.heure_depart);
trajetDiv.setAttribute("data-heure_arrivee", ride.heure_arrivee);
trajetDiv.setAttribute("data-nb_place", ride.nb_place);
trajetDiv.setAttribute("data-prix_personne", ride.prix_personne);
trajetDiv.setAttribute("data-energie", ride.energie);

        trajetDiv.style.border = "1px solid #ccc";
        trajetDiv.style.padding = "10px";
        trajetDiv.style.marginBottom = "10px";
        trajetDiv.style.borderRadius = "8px";

        trajetDiv.innerHTML = `
          <p><strong>${ride.lieu_depart}</strong> → <strong>${ride.lieu_arrivee}</strong></p>
          <p>${ride.date_depart} — ${ride.heure_depart.slice(0, 5)} à ${ride.heure_arrivee.slice(0, 5)}</p>
          <p>${ride.nb_place} places – ${ride.prix_personne} € – ${ride.energie}</p>
          <button class="btn-modifier"> Modifier</button>
          <button class="btn-supprimer"> Supprimer</button>
        `;
        
        recap.appendChild(trajetDiv); 

      });
  
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
      alert("❌ Erreur réseau");
    }

  }
  



  afficherMesTrajets();

  // Écouteur global pour tous les boutons "Supprimer"
  
   

     document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("btn-supprimer")) {
          const trajetDiv = e.target.closest("div[data-id]");
          if (!trajetDiv) return;
              
          const id = trajetDiv.dataset.id;
          const token = getToken();
      
          console.log("🛑 ID à supprimer :", id);
          console.log("🔐 Token envoyé :", token);
      
          try {
            const response = await fetch(`http://localhost:8000/api/ride/${id}`, {
              method: "DELETE",
              headers: {
                "X-AUTH-TOKEN": token
              }
            });
      
            if (response.ok) {
              alert("✅ Trajet supprimé !");
              afficherMesTrajets(); // Recharge la liste
            } else {
              const errText = await response.text();
              console.error("❌ Backend a renvoyé une erreur :", errText);
              alert("❌ Erreur suppression : " + errText);
            }
          } catch (err) {
            console.error("❌ Erreur réseau :", err);
            alert("❌ Erreur réseau.");
          }
        }
 //MODIFIER
        if (e.target.classList.contains("btn-modifier")) {
            const trajetDiv = e.target.closest("div[data-id]");
            const id = trajetDiv.dataset.id;
          
            // Empêche d'ajouter plusieurs fois un formulaire
            if (trajetDiv.querySelector(".form-modifier")) return;
          
            // Récupère les infos actuelles affichées
            const infos = trajetDiv.querySelectorAll("p");
            const [lieu, dateHeure, details] = infos;
          
            // Création du mini-formulaire
            const form = document.createElement("form");
            form.classList.add("form-modifier");
            form.innerHTML = `
  <label>Lieu départ: <input name="lieu_depart" value="${trajetDiv.dataset.lieu_depart}" /></label><br/>
  <label>Lieu arrivée: <input name="lieu_arrivee" value="${trajetDiv.dataset.lieu_arrivee}" /></label><br/>
  <label>Date: <input name="date_depart" type="date" value="${trajetDiv.dataset.date_depart}" /></label><br/>
  <label>Heure départ: <input name="heure_depart" type="time" value="${trajetDiv.dataset.heure_depart.slice(0, 5)}" /></label><br/>
  <label>Heure arrivée: <input name="heure_arrivee" type="time" value="${trajetDiv.dataset.heure_arrivee.slice(0, 5)}" /></label><br/>
  <label>Places: <input name="nb_place" type="number" value="${trajetDiv.dataset.nb_place}" /></label><br/>
  <label>Prix/personne: <input name="prix_personne" type="number" step="0.01" value="${trajetDiv.dataset.prix_personne}" /></label><br/>
  <label>Énergie: <input name="energie" value="${trajetDiv.dataset.energie}" /></label><br/>
  <button type="submit">💾 Enregistrer</button>
`;
          
            trajetDiv.appendChild(form);
          
            form.addEventListener("submit", async (event) => {
              event.preventDefault();
              const token = getToken();
          
              const formData = new FormData(form);
              const updated = Object.fromEntries(formData.entries());
              
                // ✅ Conversion des valeurs numériques
                 updated.nb_place = parseInt(updated.nb_place);
                 updated.prix_personne = parseFloat(updated.prix_personne);

              // ✅ CORRECTION DES HEURES
              if (updated.heure_depart && !updated.heure_depart.includes(":")) {
                updated.heure_depart += ":00";
              } else if (updated.heure_depart.length === 5) {
                updated.heure_depart += ":00";
              }
            
              if (updated.heure_arrivee && !updated.heure_arrivee.includes(":")) {
                updated.heure_arrivee += ":00";
              } else if (updated.heure_arrivee.length === 5) {
                updated.heure_arrivee += ":00";
              }


          
              try {
                const res = await fetch(`http://localhost:8000/api/ride/${id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "X-AUTH-TOKEN": token
                  },
                  body: JSON.stringify(updated)
                });
          
                if (res.ok) {
                  alert("✅ Trajet modifié !");
                  afficherMesTrajets();
                } else {
                  const msg = await res.text();
                  console.error("❌ Erreur modification :", msg);
                  alert("❌ Échec : " + msg);
                }
              } catch (err) {
                console.error("❌ Erreur réseau :", err);
              }
            });
          }
          

      });
      
     