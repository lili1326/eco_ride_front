 import { getAdminToken } from '../auth/auth.admin.js';
import { API_URL } from "../config.js";

console.log("Dashboard script chargé");

const token = getAdminToken();
if (!token) {
  alert("Vous n'êtes pas connecté en tant qu'administrateur.");
  window.location.href = "/signin";
}

// Fonction d’attente : vérifie toutes les 200ms que les balises <canvas> sont là
const waitUntilCanvasIsReady = () => {
  const ridesCanvas = document.getElementById('ridesChart');
  const creditsCanvas = document.getElementById('creditsChart');
  const totalCreditsText = document.getElementById('totalCredits');

  if (ridesCanvas && creditsCanvas && totalCreditsText) {
    console.log("✅ Canvas détectés. Lancement des graphiques.");
    loadRidesChart(token);
    loadCreditsChart(token);
  } else {
    console.log("⏳ En attente des éléments du DOM...");
    setTimeout(waitUntilCanvasIsReady, 200);
  }
};

waitUntilCanvasIsReady();

async function loadRidesChart(token) {
  console.log("📡 Requête GET : Rides");

  try {
    const response = await fetch(`${API_URL}/api/admin/dashboard/rides-stats`, {
      headers: { 'X-AUTH-TOKEN': token }
    });
    const data = await response.json();
    console.log("📊 Données trajets :", data);

    const labels = data.map(d => d.jour);
    const values = data.map(d => d.nb);

    new Chart(document.getElementById('ridesChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Covoiturages',
          data: values,
          borderWidth: 2,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  } catch (e) {
    console.error("❌ Erreur chargement rides :", e);
  }
}

async function loadCreditsChart(token) {
  console.log("📡 Requête GET : Credits");

  try {
    const response = await fetch(`${API_URL}/api/admin/dashboard/credits-per-day`, {
      headers: { 'X-AUTH-TOKEN': token }
    });

    const text = await response.text();
    console.log("📥 Réponse brute :", text);
    const data = JSON.parse(text);

    const labels = data.map(d => d.jour);
    const values = data.map(d => Number(d.credits));
    const total = values.reduce((sum, val) => sum + val, 0);

    document.getElementById("totalCredits").textContent = `${total} crédits`;

    new Chart(document.getElementById('creditsChart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Gains (Crédits)',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  } catch (e) {
    console.error("❌ Erreur chargement crédits :", e);
  }
}
