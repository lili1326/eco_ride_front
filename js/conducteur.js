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

    const horaire = form.horaire.value.trim(); // exemple : "08h00/09h00"
    let departTime = "", arriveeTime = "";
    
    if (/^[0-2][0-9]h[0-5][0-9]\/[0-2][0-9]h[0-5][0-9]$/.test(horaire)) {
      const [dep, arr] = horaire.split("/");
      departTime = dep.replace("h", ":") + ":00";   // ex : 08:00:00
      arriveeTime = arr.replace("h", ":") + ":00";  // ex : 09:00:00
    } else {
      alert("❌ Format horaire invalide. Format attendu : 08h00/10h30");
      return;
    }
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

// Formatage date
const d = new Date(ride.date_depart);
const dateFormatee = !isNaN(d.getTime()) ? d.toLocaleDateString("fr-FR") : "Date inconnue";

// Formatage heure
function extraireHeure(isoString) {
  const date = new Date(isoString);
  if (isNaN(date)) return "??:??";
  return date.toTimeString().slice(0, 5);
}

const heureDep = extraireHeure(ride.heure_depart);
const heureArr = extraireHeure(ride.heure_arrivee);

const recap = document.getElementById("recap-trajet");
recap.innerHTML = `
  <h4>📝 Récapitulatif du trajet proposé :</h4>
  <ul style="list-style: none; padding-left: 0;">
    <li><strong>Départ :</strong> ${ride.lieu_depart} à ${heureDep}</li>
    <li><strong>Arrivée :</strong> ${ride.lieu_arrivee} à ${heureArr}</li>
    <li><strong>Date :</strong> ${dateFormatee}</li>
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
    
      function extraireHeure(isoString) {
        const d = new Date(isoString);
        if (isNaN(d)) return "??:??";
        return d.toTimeString().slice(0, 5); // "08:00"
      }
      trajets.forEach(ride => {
        const trajetDiv = document.createElement("div");
      
        const d = new Date(ride.date_depart);
        const dateFormatee = !isNaN(d.getTime()) ? d.toLocaleDateString("fr-FR") : "Date inconnue";
      
        const heureDep = extraireHeure(ride.heure_depart);
        const heureArr = extraireHeure(ride.heure_arrivee);
      
        trajetDiv.style.border = "1px solid #ccc";
        trajetDiv.style.padding = "10px";
        trajetDiv.style.marginBottom = "10px";
        trajetDiv.style.borderRadius = "8px";
      
        trajetDiv.innerHTML = `
          <p><strong>${ride.lieu_depart}</strong> → <strong>${ride.lieu_arrivee}</strong></p>
          <p>${dateFormatee} — ${heureDep} à ${heureArr}</p>
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
      
     