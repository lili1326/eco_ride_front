console.log("profil.js chargé !");
const input = document.getElementById("uploadInput");
const avatar = document.getElementById("avatar");

if (!input || !avatar) {
  console.warn("avatar ou input non trouvé");
} else {
  const savedImage = localStorage.getItem("userAvatar");
  if (savedImage) {
    avatar.src = savedImage;
    console.log("Image chargée depuis localStorage");
  }

  input.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target.result;
        avatar.src = base64;
        localStorage.setItem("userAvatar", base64);
        console.log("Image enregistrée !");
      };
      reader.readAsDataURL(file);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  if (!token) return;

  fetch("http://localhost:8000/api/account/me", {
      headers: {
          "X-AUTH-TOKEN": token
      }
  })
  .then(res => res.json())
  .then(user => {
      // Pré-remplir les champs input avec les données utilisateur
      document.getElementById("PseudoInput").value = user.pseudo || "";
      document.getElementById("PrenomInput").value = user.firstName || "";
  })
  .catch(error => {
      console.error("Erreur lors du chargement des infos utilisateur :", error);
  });
});

