 const updatedUser = {
  firstName: "Nouveau prénom",
  email: "nouvel@email.com",
  password: "nouveaumotdepasse" // facultatif
};

fetch(`${API_URL}/api/account/edit`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "X-AUTH-TOKEN": getToken()
  },
  body: JSON.stringify(updatedUser)
})
.then(res => {
  if (res.ok) {
    alert("Modifications enregistrées !");
  } else {
    alert("Erreur lors de la mise à jour.");
  }
});
