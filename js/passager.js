 const token = getToken();
console.log("Chargement des trajets…");
async function loadParticipations() {
  const res = await fetch('http://localhost:8000/api/passager/trajets', {
    headers: { 'X-AUTH-TOKEN': token }
  });

  const trajets = await res.json();
  const container = document.getElementById('trajets-container');
  container.innerHTML = "";

  trajets.forEach(t => {
    const div = document.createElement('div');
     const conducteurId = t.conducteur?.id;
    
    const rideId = t.id;

    div.innerHTML = `
      <h3>${t.lieu_depart} → ${t.lieu_arrivee}</h3>
      <p>Date : ${t.date_depart}</p>
      <p>Conducteur : ${t.conducteur?.firstName ?? "?"}</p>
      <p><strong>Statut : ${t.statut ?? "à venir"}</strong></p>
    `;
console.log("CHECK", t.id, t.statut, conducteurId, t.avisDejaLaisse);
    if ((t.statut === "en_cours" || t.statut === "termine") && conducteurId && !t.avisDejaLaisse) {
      console.log("AFFICHER AVIS")
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
      const res = await fetch("http://localhost:8000/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const err = await res.text();
        alert("Erreur lors de la publication : " + err);
        return;
      }

      alert("Merci pour votre avis !");
      container.innerHTML = "";
      loadParticipations();
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  });

  container.appendChild(form);
}

loadParticipations();
