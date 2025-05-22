  import { API_URL } from "./config.js";
  
  
  const token = getToken();
console.log("Chargement des trajets…");
 
 async function loadParticipations() {
  const res = await fetch(`${API_URL}/api/passager/trajets`, {
    headers: { 'X-AUTH-TOKEN': token }
  });

  const trajets = await res.json();
  const avis = await fetchAvis(); //  On récupère tous les avis de l'utilisateur

  const avisMap = new Map(); // key = rideId, value = review
  avis.forEach(r => {
    const id = r.covoiturage?.id;
    if (id) avisMap.set(id, r);
  });

  const container = document.getElementById('trajets-container');
  container.innerHTML = "";

  trajets.forEach(t => {
    const div = document.createElement('div');
    const conducteurId = t.conducteur?.id;
    const rideId = t.id;

    div.innerHTML = `
      <h3>${t.lieu_depart} → ${t.lieu_arrivee}</h3>
      <p>Date : ${new Date(t.date_depart).toLocaleDateString("fr-FR")}</p>
      <p>Conducteur : ${t.conducteur?.firstName ?? "?"}</p>
      <p><strong>Statut : ${t.statut ?? "à venir"}</strong></p>
    `;

    const avisExistant = avisMap.get(rideId);

    if (avisExistant) {
      div.innerHTML += `
        <div class="avis-deja-laisse">
          <p><strong>Votre avis :</strong></p>
          <p>Note : ${avisExistant.note}/5</p>
          <p>Commentaire : ${avisExistant.commentaire}</p>
        </div>
      `;
    }

    if ((t.statut === "en_cours" || t.statut === "termine") && conducteurId && !t.avisDejaLaisse) {
      const btnAvis = document.createElement("button");
      btnAvis.textContent = "Mon avis";
      btnAvis.classList.add("btn-avis");
      btnAvis.addEventListener("click", () =>
        afficherFormulaireAvis(rideId, conducteurId)
      );
      div.appendChild(btnAvis);
    }

    container.appendChild(div);
  });
}
   
 function afficherFormulaireAvis(rideId, conducteurId) {
  const container = document.getElementById('form-avis-container');
  container.innerHTML = "";

  const form = document.createElement("form");
  form.className = "cardAvis";
  form.dataset.rideId = rideId;
  form.dataset.conducteurId = conducteurId;

  form.innerHTML = `
    <h4>Laisser un avis</h4>
    <label>Note (1-5): <input type="number" name="note" min="1" max="5" required></label><br>
    <label>Commentaire:<br><textarea name="commentaire" rows="3" cols="30" required></textarea></label><br>
    <button type="submit">Publier l’avis</button>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = getToken();
    const formData = new FormData(form);
    const rideId = form.dataset.rideId;
    const conducteurId = form.dataset.conducteurId;

    const data = {
      note: parseInt(formData.get("note"), 10),
      commentaire: formData.get("commentaire"),
      conducteur: `/api/users/${conducteurId}`,
      covoiturage: `/api/ride/${rideId}`
    };

    console.log("Data envoyée :", data);

    try {
      const res = await fetch(`${API_URL}/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token
        },
        body: JSON.stringify(data)
      });

      const text = await res.text();

      if (!res.ok) {
        try {
          const json = JSON.parse(text);
          if (res.status === 403 && json.error?.includes("pas encore terminé")) {
            alert("⏳ Vous pourrez laisser votre avis une fois le trajet terminé.");
          } else if (res.status === 409) {
            alert("⚠️ Vous avez déjà laissé un avis pour ce trajet.");
          } else {
            alert("❌ Erreur : " + (json.error || "Erreur inconnue."));
          }
        } catch {
          alert("❌ Une erreur est survenue.");
        }
        return;
      }

      alert("Merci pour votre avis !");
      container.innerHTML = "";
      loadParticipations(); // ✅ Recharge les trajets pour masquer le bouton
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    }
  });

  container.appendChild(form);
}


loadParticipations();


async function fetchAvis() {
  const res = await fetch(`${API_URL}/api/review/mes-avis`, {
    headers: { 'X-AUTH-TOKEN': token }
  });

  if (!res.ok) return [];

  return await res.json();
}