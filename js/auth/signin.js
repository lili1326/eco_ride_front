import { setToken, getToken } from "./auth.js"; 

const pseudoInput = document.getElementById("PseudoInput");
const mailInput =document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSingin = document.getElementById("btnSignin");

 


btnSingin.addEventListener("click", checkCredentials);//information de connection



   async function checkCredentials() {

const role = document.querySelector('input[name="role"]:checked').value;
const loginUrl = role === 'admin'
  ? "http://localhost:8000/api/admin/login"
  : "http://localhost:8000/api/login";

    const payload = {
        username: mailInput.value,
        password: passwordInput.value
    };

    try {
        const response = await fetch( loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            // Connexion réussie
            const token = result.apiToken;
            const roles = result.roles;

            //  Stocker le token avec ta fonction centralisée
            setToken(token);
        
            //  Extraire un rôle utile (ex: client, admin)
            let mainRole = roles.find(r => r !== 'ROLE_USER') || 'client'; // fallback client

            mainRole = mainRole.replace('ROLE_', '').toLowerCase();
        
            //  Stocker le rôle en cookie
            setCookie(RoleCookieName, mainRole.toLowerCase(), 7);
            showAndHideElementsForRoles();
        
            //  Rediriger

            if (mainRole === "admin") {
  window.location.replace("/admin-dashboard");
} else {
  window.location.replace("/account");
}


        } else {
            //  Mauvais identifiants
            mailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
        }
    } catch (error) {
        console.error("Erreur réseau : ", error);
        alert("Erreur de connexion au serveur.");
    }
}
//Accéder ensuite à une route sécurisée avec le token
fetch("http://localhost:8000/api/account/me", {
  method: "GET",
  headers: {
      "Content-Type": "application/json",
       "X-AUTH-TOKEN": getToken()
  }
})
.then(response => response.json())
.then(data => console.log("Infos utilisateur : ", data));


//Et pour afficher le pseudo sur /account :
 
const userToken = getToken();

if (userToken) {
    fetch("http://localhost:8000/api/account/me", {
        headers: {
            "X-AUTH-TOKEN": userToken
        }
    })
    .then(res => res.json())
    .then(user => {
        document.querySelector("#welcome").textContent = `Bienvenue, ${user.pseudo}`;
    });
} 