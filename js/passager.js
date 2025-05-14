 const token = getToken();

async function loadParticipations() {
  const res = await fetch('http://localhost:8000/api/passager/trajets', {
    headers: { 'X-AUTH-TOKEN': token }
  });

  const trajets = await res.json();
  const container = document.getElementById('trajets-container');
  container.innerHTML = "";

  trajets.forEach(t => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${t.lieu_depart} → ${t.lieu_arrivee}</h3>
      <p>Date : ${t.date_depart}</p>
      <p>Conducteur : ${t.conducteur}</p>
       <p><strong>Statut : ${t.statut ?? "à venir"}</strong></p>
      <hr>
    `;
    container.appendChild(div);
  });
}

async function changerStatut(rideId, newStatut) {
  await fetch('http://localhost:8000/api/passager/statut', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-AUTH-TOKEN': token
    },
    body: JSON.stringify({ ride_id: rideId, statut: newStatut })
  });

  loadParticipations(); // recharge les données
}

loadParticipations();
