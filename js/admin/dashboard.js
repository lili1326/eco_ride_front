 // Importation du token d'authentification pour l'administrateur
import { getAdminToken } from '../auth/auth.admin.js';
// Importation de l’URL de l’API depuis la configuration
import { API_URL } from "../config.js";

// Message de confirmation que le script est bien chargé
console.log("Dashboard script chargé");

// Récupération du token d'authentification administrateur
const token = getAdminToken();
// Si aucun token n'est trouvé, on redirige vers la page de connexion
if (!token) {
  alert("Vous n'êtes pas connecté en tant qu'administrateur.");
  window.location.href = "/signin";
}

/**
 * Fonction récursive qui attend que les éléments <canvas> du DOM soient prêts.
 * Elle vérifie toutes les 200 ms que les éléments nécessaires sont disponibles,
 * puis lance les fonctions de chargement des graphiques.
 */
const waitUntilCanvasIsReady = () => {
  const ridesCanvas = document.getElementById('ridesChart');
  const creditsCanvas = document.getElementById('creditsChart');
  const totalCreditsText = document.getElementById('totalCredits');

  if (ridesCanvas && creditsCanvas && totalCreditsText) {
    console.log("Canvas détectés. Lancement des graphiques.");
    loadRidesChart(token);
    loadCreditsChart(token);
  } else {
    console.log("En attente des éléments du DOM...");
    setTimeout(waitUntilCanvasIsReady, 200);
  }
};

// Lancement de la vérification du DOM au chargement du script
waitUntilCanvasIsReady();

/**
 * Fonction asynchrone qui récupère les statistiques des trajets via l'API.
 * Elle transforme les données reçues pour les afficher sous forme de graphique en ligne (Chart.js).
 * @param {string} token - Jeton d'authentification administrateur
 */
async function loadRidesChart(token) {
 // console.log("📡 Requête GET : Rides");

  try {
    const response = await fetch(`${API_URL}/api/admin/dashboard/rides-stats`, {
      headers: { 'X-AUTH-TOKEN': token }
    });
    const data = await response.json();
    //console.log("📊 Données trajets :", data);

    const labels = data.map(d => d.jour); // Extraire les dates
    const values = data.map(d => d.nb);   // Extraire le nombre de trajets

    // Création d’un graphique en ligne pour visualiser les trajets par jour
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

/**
 * Fonction asynchrone qui récupère les crédits gagnés par jour via l'API.
 * Elle affiche le total des crédits et construit un graphique en barres (Chart.js).
 * @param {string} token - Jeton d'authentification administrateur
 */
async function loadCreditsChart(token) {
  //console.log("📡 Requête GET : Credits");

  try {
    const response = await fetch(`${API_URL}/api/admin/dashboard/credits-per-day`, {
      headers: { 'X-AUTH-TOKEN': token }
    });

    const text = await response.text(); // On récupère d'abord la réponse brute
    //console.log("Réponse brute :", text);
    const data = JSON.parse(text); // Puis on la parse manuellement en JSON

    const labels = data.map(d => d.jour); // Extraire les dates
    const values = data.map(d => Number(d.credits)); // Extraire les crédits (en nombre)
    const total = values.reduce((sum, val) => sum + val, 0); // Calcul du total additionne tous les éléments du tableau values en utilisant la méthode reduce()

    // Mise à jour de l’élément texte affichant le total des crédits
    document.getElementById("totalCredits").textContent = `${total} crédits`;

    // Création d’un graphique en barres pour visualiser les crédits gagnés par jour
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

