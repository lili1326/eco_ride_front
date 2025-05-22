  
 import { getAdminToken } from '../auth/auth.admin.js';
 import { API_URL } from "../config.js";

const token = getAdminToken();

if (!token) {
    alert("Vous n'êtes pas connecté en tant qu'administrateur.");
    window.location.href = "/signin"; // redirection sécurisée
}
 async function loadRidesChart() {
    const response = await fetch( `${API_URL}/api/admin/dashboard/rides-per-day`, {
        headers: {
            'X-AUTH-TOKEN': token
        }
    });
    const data = await response.json();

    const labels = data.map(d => d.jour);
    const values = data.map(d => d.total);

    

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
}

 async function loadCreditsChart() {
    const response = await fetch( `${API_URL}/api/admin/dashboard/credits-per-day` , {
        headers: {
            'X-AUTH-TOKEN': token
        }
    });
    const text = await response.text(); // lis la réponse brute
    console.log("Réponse brute :", text);
console.log("Réponse brute :", text); 
    try {
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
        console.error("Erreur JSON ou graphique :", e);
    }
}


loadRidesChart();
loadCreditsChart();
