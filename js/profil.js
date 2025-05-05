console.log("profil.js chargé");

document.addEventListener("DOMContentLoaded", () => {
  const pseudoInput = document.getElementById("PseudoInput");
  const prenomInput = document.getElementById("PrenomInput");

  if (!pseudoInput || !prenomInput) {
    console.warn("⛔ Éléments profil introuvables sur cette page");
    return;
  }

  const token = getToken();
  if (!token) return;

  fetch("http://localhost:8000/api/account/me", {
    headers: {
      "X-AUTH-TOKEN": token
    }
  })
    .then(res => res.json())
    .then(user => {
      pseudoInput.value = user.pseudo || "";
      prenomInput.value = user.firstName || "";
    })
    .catch(err => {
      console.error("Erreur de chargement user :", err);
    });
});
