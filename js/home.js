console.log("✅ home.js chargé");

const btn = document.getElementById("btn-home-search");
if (!btn) {
  console.error("❌ Bouton btn-home-search non trouvé !");
} else {
  btn.addEventListener("click", () => {
    console.log("✅ Clic détecté");

    const depart = document.getElementById("depart").value;
    const arrivee = document.getElementById("arrivee").value;
    const date = document.getElementById("date").value;

    const params = new URLSearchParams();
    if (depart) params.append("depart", depart);
    if (arrivee) params.append("arrivee", arrivee);
    if (date) params.append("date", date);

    window.location.href = `/covoiturage?${params.toString()}`;
  });
}