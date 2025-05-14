import { getToken } from "./auth/auth.js";


console.log("Script conducteur.js chargé");

//  pour récupérer le token depuis localStorage
 

setTimeout(() => {
  const form = document.getElementById("form-trajet");
// Charger les véhicules dans le <select>
const selectVoiture = document.getElementById("voiture");
if (selectVoiture) {
  fetch("http://localhost:8000/api/car/mes-vehicules", {
    headers: { "X-AUTH-TOKEN": getToken() }
  })
    .then(res => res.json())
    .then(cars => {
      cars.forEach(car => {
        const opt = document.createElement("option");
        opt.value = `/api/car/${car.id}`; // format IRI
        opt.textContent = `${car.marque} ${car.modele} (${car.couleur})`;
        selectVoiture.appendChild(opt);
      });
    })
    .catch(err => {
      console.error(" Erreur chargement véhicules :", err);
    });
}


  if (!form) {
    console.warn(" Formulaire 'form-trajet' introuvable.");
    return;
  }

  console.log(" Formulaire détecté");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert(" Utilisateur non authentifié.");
      return;
    }
   
    console.log(" Soumission interceptée");

    const horaire = form.horaire.value.trim(); // exemple : "08h00/09h00"
    let departTime = "", arriveeTime = "";
    
    if (/^[0-2][0-9]h[0-5][0-9]\/[0-2][0-9]h[0-5][0-9]$/.test(horaire)) {
      const [dep, arr] = horaire.split("/");
      departTime = dep.replace("h", ":") + ":00";   // ex : 08:00:00
      arriveeTime = arr.replace("h", ":") + ":00";  // ex : 09:00:00
    } else {
      alert(" Format horaire invalide. Format attendu : 08h00/10h30");
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
      energie: form.energie.value,
      voiture: form.voiture.value 
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
      const result = await response.json(); //  Lire d'abord le JSON
      if (!response.ok) {
        const text = await response.text();
        console.error(" Erreur backend :", text);
        alert(" Erreur lors de la création du trajet.");
        return;
      }
      alert(" Trajet bien enregistré !");

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
  <h4> Récapitulatif du trajet proposé :</h4>
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
      console.error(" Erreur réseau :", err);
      alert(" Erreur réseau ou serveur.");
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

function changerStatut(rideId, statut) {
  const token = getToken();

  fetch(`http://localhost:8000/api/ride/${rideId}/statut`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": token
    },
    body: JSON.stringify({ statut })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      afficherMesTrajets(); // pour rafraîchir après changement
    })
    .catch(err => console.error("Erreur :", err));
}

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
        console.error(" Erreur en récupérant les trajets :", text);
        alert(" Impossible de récupérer les trajets.");
        return;
      }
  
      const trajets = await response.json();
      const recap = document.getElementById("recap-trajet");
  
      if (!trajets.length) {
        recap.innerHTML = "<p> Aucun trajet enregistré.</p>";
        return;
      }
  
      recap.innerHTML = "<h4> Mes trajets</h4>";
    
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

  trajetDiv.dataset.id = ride.id;
  trajetDiv.dataset.lieu_depart = ride.lieu_depart;
  trajetDiv.dataset.lieu_arrivee = ride.lieu_arrivee;
  trajetDiv.dataset.date_depart = ride.date_depart;
  trajetDiv.dataset.heure_depart = ride.heure_depart;
  trajetDiv.dataset.heure_arrivee = ride.heure_arrivee;
  trajetDiv.dataset.nb_place = ride.nb_place;
  trajetDiv.dataset.prix_personne = ride.prix_personne;
  trajetDiv.dataset.energie = ride.energie;

  // Affichage du statut si présent
  const statut = ride.statut || "non défini";
  let html = `
    <p><strong>${ride.lieu_depart}</strong> → <strong>${ride.lieu_arrivee}</strong></p>
    <p>${dateFormatee} — ${heureDep} à ${heureArr}</p>
    <p>${ride.nb_place} places – ${ride.prix_personne} € – ${ride.energie}</p>
    <p><strong>Statut :</strong> ${statut}</p>
  `;

  // Ajout des boutons seulement si statut non "en_cours" ou "termine"
  if (statut !== "en_cours" && statut !== "termine") {
    html += `
      <button class="btn-modifier">Modifier</button>
      <button class="btn-supprimer">Supprimer</button>
      <button class="btn-demarrer">Démarrer</button>
    `;
  }

  // Si en cours, afficher uniquement le bouton "Arriver"
  if (statut === "en_cours") {
    html += `<button class="btn-arriver">Arriver</button>`;
  }

  trajetDiv.innerHTML = html;
  recap.appendChild(trajetDiv);

  // Ajout des événements
  const btnStart = trajetDiv.querySelector(".btn-demarrer");
  if (btnStart) {
    btnStart.addEventListener("click", () => changerStatut(ride.id, "en_cours"));
  }

  const btnEnd = trajetDiv.querySelector(".btn-arriver");
  if (btnEnd) {
    btnEnd.addEventListener("click", () => changerStatut(ride.id, "termine"));
  }
});





    } catch (err) {
      console.error(" Erreur réseau :", err);
      alert(" Erreur réseau");
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
      
          console.log(" ID à supprimer :", id);
          console.log(" Token envoyé :", token);
      
          try {
            const response = await fetch(`http://localhost:8000/api/ride/${id}`, {
              method: "DELETE",
              headers: {
                "X-AUTH-TOKEN": token
              }
            });
      
            if (response.ok) {
              alert(" Trajet supprimé !");
              afficherMesTrajets(); // Recharge la liste
            } else {
              const errText = await response.text();
              console.error(" Backend a renvoyé une erreur :", errText);
              alert(" Erreur suppression : " + errText);
            }
          } catch (err) {
            console.error(" Erreur réseau :", err);
            alert(" Erreur réseau.");
          }
        }

 //MODIFIER
        if (e.target.classList.contains("btn-modifier")) {
            const trajetDiv = e.target.closest("div[data-id]");
            console.log("🔍 trajetDiv:", trajetDiv);
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
  <button type="submit"> Enregistrer</button>
`;
          
            trajetDiv.appendChild(form);
          
            form.addEventListener("submit", async (event) => {
              event.preventDefault();
              const token = getToken();
          
              const formData = new FormData(form);
              const updated = Object.fromEntries(formData.entries());
              
                //  Conversion des valeurs numériques
                 updated.nb_place = parseInt(updated.nb_place);
                 updated.prix_personne = parseFloat(updated.prix_personne);

              //  CORRECTION DES HEURES
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

              console.log(" Données envoyées au backend :", updated);
          
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
                  alert(" Trajet modifié !");
                  afficherMesTrajets();
                } else {
                  const msg = await res.text();
                  console.error(" Erreur modification :", msg);
                  alert(" Échec : " + msg);
                }
              } catch (err) {
                console.error(" Erreur réseau :", err);
              }
            });
          }
          

      });
      
     
 //CAR

console.log(" Script car.js chargé");

// Soumission du formulaire ajout de véhicule
setTimeout(() => {
  const form = document.getElementById("form-car");

  if (!form) {
    console.warn(" Formulaire 'form-car' introuvable.");
    return;
  }

  console.log(" Formulaire véhicule détecté");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert(" Utilisateur non authentifié.");
      return;
    }

    const data = {
      marque: form.marque.value,
      modele: form.modele.value,
      immatriculation: form.plaque.value,
      couleur: form.couleur.value,
      energie: form.energie.value,
      nb_places: parseInt(form.nb_places.value),
      date_premiere_immatriculation: form.date.value,
    };

    try {
      const response = await fetch("http://localhost:8000/api/car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(" Erreur backend :", text);
        alert(" Erreur lors de la création du véhicule.");
        return;
      }

      alert(" Véhicule enregistré !");

      afficherVehicules();

    } catch (err) {
      console.error(" Erreur réseau :", err);
      alert(" Erreur réseau ou serveur.");
    }
  });
}, 500);

// Affichage des véhicules
async function afficherVehicules() {
  const token = getToken();
  const recap = document.getElementById("recap-vehicules");
  if (!recap) return;

  recap.innerHTML = "";
  try {
    const res = await fetch("http://localhost:8000/api/car/mes-vehicules", {
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      }
    });

    if (!res.ok) {
      recap.innerHTML = "<p>Erreur chargement véhicules</p>";
      return;
    }

    const cars = await res.json();
    if (!cars.length) {
      recap.innerHTML = "<p>Aucun véhicule enregistré.</p>";
      return;
    }

    cars.forEach(car => {
      recap.innerHTML += `
        <div class="car-card" data-id="${car.id}" data-marque="${car.marque}" data-modele="${car.modele}" data-immatriculation="${car.immatriculation}" data-couleur="${car.couleur}" data-energie="${car.energie}" data-nb_places="${car.nb_places}" data-date="${car.date_premiere_immatriculation}">
          <p><strong>${car.marque} ${car.modele}</strong> - ${car.immatriculation}</p>
          <p>${car.couleur} • ${car.nb_places} places • ${car.energie}</p>
          <p>1ère immatriculation : ${new Date(car.date_premiere_immatriculation).toLocaleDateString("fr-FR")}</p>
          <button class="btn-modifier-car">Modifier</button>
          <button class="btn-supprimer-car">Supprimer</button>
        </div>
      `;
    });
  } catch (err) {
    console.error("Erreur chargement véhicules:", err);
  }
}

// Initialiser affichage
document.addEventListener("DOMContentLoaded", afficherVehicules);
  
 //  Bouton pour voir manuellement
 const btn = document.getElementById("btn-mes-vehicules");
 if (btn) {
   btn.addEventListener("click", afficherVehicules);
    //form.reset();
afficherVehicules();
 }

// Gestion suppression et modification inline
document.addEventListener("click", async (e) => {
  const token = getToken();

  //  SUPPRIMER UN VÉHICULE
  if (e.target.classList.contains("btn-supprimer-car")) {
    console.log(" Clic sur supprimer détecté");
    const card = e.target.closest(".car-card");
    const id = card.dataset.id;

    if (confirm(" Supprimer ce véhicule ?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/car/${id}`, {
          method: "DELETE",
          headers: {
            "X-AUTH-TOKEN": token
          }
        });

        if (response.ok) {
          alert(" Véhicule supprimé !");
          afficherVehicules(); // Recharge la liste
        } else {
          const errText = await response.text();
          console.error(" Erreur backend :", errText);
          alert(" Erreur lors de la suppression du véhicule.");
        }
      } catch (err) {
        console.error(" Erreur réseau :", err);
        alert(" Erreur réseau.");
      }
    }
  }
  //  MODIFIER UN VÉHICULE
  if (e.target.classList.contains("btn-modifier-car")) {
    console.log(" Clic sur modifier détecté");
    const card = e.target.closest(".car-card");
    const id = card.dataset.id;

    // Ne pas dupliquer le formulaire
    if (card.querySelector("form")) return;

    const form = document.createElement("form");
    form.classList.add("form-modifier");
    form.innerHTML = `
      <label>Marque: <input name="marque" value="${card.dataset.marque}"></label><br/>
      <label>Modèle: <input name="modele" value="${card.dataset.modele}"></label><br/>
      <label>Plaque: <input name="immatriculation" value="${card.dataset.immatriculation}"></label><br/>
      <label>Couleur: <input name="couleur" value="${card.dataset.couleur}"></label><br/>
      <label>Énergie: <input name="energie" value="${card.dataset.energie}"></label><br/>
      <label>Places: <input name="nb_places" type="number" value="${card.dataset.nb_places}"></label><br/>
      <label>Date immatriculation: <input name="date_premiere_immatriculation" type="date" value="${card.dataset.date.slice(0, 10)}"></label><br/>
      <button type="submit"> Enregistrer</button>
    `;

    card.appendChild(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const updated = Object.fromEntries(formData.entries());
      updated.nb_places = parseInt(updated.nb_places);

      try {
        const res = await fetch(`http://localhost:8000/api/car/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": token
          },
          body: JSON.stringify(updated)
        });

        if (res.ok) {
          alert("Véhicule modifié !");
          afficherVehicules();
        } else {
          const msg = await res.text();
          console.error(" Erreur modification :", msg);
          alert(" Échec : " + msg);
        }
      } catch (err) {
        console.error(" Erreur réseau :", err);
      }
    });
  }
});
 


//------------------------------------PREFERENCE-----------------------------------------------------
console.log(" Script preference.js chargé");

// Soumission du formulaire ajout de préférence
setTimeout(() => {
  const form = document.getElementById("preferences-form");

  if (!form) {
    console.warn(" Formulaire 'preferences-form' introuvable.");
    return;
  }

  console.log(" Formulaire préférence détecté");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert(" Utilisateur non authentifié.");
      return;
    }

    const data = {
      fumeur: form.fumeur.value ,
      animaux: form.animaux.value ,
      musique: form.musique.value ,
      description: form.description.value ,
    };

    try {
      const response = await fetch("http://localhost:8000/api/preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(" Erreur backend :", text);
        alert(" Erreur lors de la création de la préférence.");
        return;
      }

      alert(" Préférence enregistrée !");
      afficherPreferences();

    } catch (err) {
      console.error(" Erreur réseau :", err);
      alert(" Erreur réseau ou serveur.");
    }
  });
}, 500);

// Affichage des préférences (structure identique à afficherVehicules)
async function afficherPreferences() {
  const token = getToken();
  const recap = document.getElementById("recap-preference");
  if (!recap) return;

  recap.innerHTML = "";
  try {
    const res = await fetch("http://localhost:8000/api/preference/me", {
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      }
    });

    if (!res.ok) {
      recap.innerHTML = "<p>Erreur chargement des préférences</p>";
      return;
    }

    const pref = await res.json();

    recap.innerHTML += `
      <div class="pref-card"
           data-id="${pref.id}"
           data-fumeur="${pref.fumeur}"
           data-animaux="${pref.animaux}"
           data-musique="${pref.musique}"
           data-description="${pref.description}">
        <p><strong>Préférences utilisateur</strong></p>
        <p> Fumeur : ${pref.fumeur}</p>
        <p> Animaux : ${pref.animaux}</p>
        <p> Musique : ${pref.musique}</p>
        <p> Description : ${pref.description}</p>
        <button class="btn-modifier-pref">Modifier</button>
        <button class="btn-supprimer-pref">Supprimer</button>
      </div>
    `;
  } catch (err) {
    console.error("Erreur chargement préférences:", err);
    recap.innerHTML = "<p> Erreur réseau</p>";
  }
}


// Initialiser affichage
document.addEventListener("DOMContentLoaded", afficherPreferences);

// Bouton manuel si présent
const btn1 = document.getElementById("btn-mes-preferences");
if (btn1) {
  btn1.addEventListener("click", afficherPreferences);
  afficherPreferences();
}

 // Gestion des boutons "Supprimer" et "Modifier"
document.addEventListener("click", async (e) => {
  const token = getToken();

  //  SUPPRIMER
  if (e.target.classList.contains("btn-supprimer-pref")) {
    const card = e.target.closest(".pref-card");
    const id = card.dataset.id;

    if (confirm(" Supprimer cette préférence ?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/preference/${id}`, {
          method: "DELETE",
          headers: {
            "X-AUTH-TOKEN": token
          }
        });

        if (response.ok) {
          alert(" Préférence supprimée !");
          afficherPreferences();
        } else {
          const errText = await response.text();
          console.error(" Backend a renvoyé une erreur :", errText);
          alert(" Erreur suppression : " + errText);
        }
      } catch (err) {
        console.error(" Erreur réseau :", err);
        alert(" Erreur réseau.");
      }
    }
  }

  //  MODIFIER
  if (e.target.classList.contains("btn-modifier-pref")) {
    const card = e.target.closest(".pref-card");
    const id = card.dataset.id;

    const form = document.createElement("form");
    form.classList.add("form-modifier");
    form.innerHTML = `
      <label>Fumeur:
        <select name="fumeur">
          <option value="oui" ${card.dataset.fumeur === "oui" ? "selected" : ""}>Oui</option>
          <option value="non" ${card.dataset.fumeur === "non" ? "selected" : ""}>Non</option>
        </select>
      </label><br/>
      <label>Animaux:
        <select name="animaux">
          <option value="oui" ${card.dataset.animaux === "oui" ? "selected" : ""}>Oui</option>
          <option value="non" ${card.dataset.animaux === "non" ? "selected" : ""}>Non</option>
        </select>
      </label><br/>
      <label>Musique:
        <input type="text" name="musique" value="${card.dataset.musique || ""}">
      </label><br/>
      <label>Description:
        <textarea name="description">${card.dataset.description || ""}</textarea>
      </label><br/>
      <button type="submit"> Enregistrer</button>
    `;

    card.replaceWith(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const updated = Object.fromEntries(formData.entries());

      try {
        const res = await fetch(`http://localhost:8000/api/preference/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": token
          },
          body: JSON.stringify(updated)
        });

        if (res.ok) {
          alert(" Préférences mises à jour !");
          afficherPreferences();
        } else {
          const errText = await res.text();
          console.error(" Erreur modification :", errText);
          alert(" Échec de la modification.");
        }
      } catch (err) {
        console.error(" Erreur réseau :", err);
      }
    });
  }

});

 