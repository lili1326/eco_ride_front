import { setToken, getToken } from "./auth.js"; 
import { setAdminToken } from "./auth.admin.js";
import { API_URL } from "../config.js";
 
 const pseudoInput = document.getElementById("PseudoInput");
const mailInput =document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSingin = document.getElementById("btnSignin");

 


btnSingin.addEventListener("click", checkCredentials);//information de connection



async function checkCredentials() {
const role = document.querySelector('input[name="role"]:checked').value;
const loginUrl = role === 'admin'
    ? `${API_URL}/api/admin/login`
    : `${API_URL}/api/login`;

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
          const token = result.token ?? result.apiToken;
          const roles = result.roles;

//  Stocker le token avec ta fonction centralisée
         setToken(token);
        
// Extraire un rôle utile (ex: client, admin)
         let mainRole = roles.find(r => r !== 'ROLE_USER') || 'client'; // fallback client

         mainRole = mainRole.replace('ROLE_', '').toLowerCase();
        
//stocke le rôle dans localStorage
        localStorage.setItem("user_role", mainRole);
 

 //  Stocker le rôle en cookie

         setCookie(RoleCookieName, mainRole.toLowerCase(), 7);
         showAndHideElementsForRoles();
         console.log("🎫 token =", token);
console.log("👤 role =", mainRole);
            
   if (mainRole === "admin") {
  setAdminToken(token);        //  stocke sous admin_token
    window.history.pushState({}, "", " /admin-dashboard");
window.dispatchEvent(new PopStateEvent("popstate"));
 // window.location.replace("/admin-dashboard");
} else {
  setToken(token);
    
  window.history.pushState({}, "", "/account");
window.dispatchEvent(new PopStateEvent("popstate"));
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
fetch(`${API_URL}/api/account/me`, {
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
    fetch(`${API_URL}/api/account/me` , {
        headers: {
            "X-AUTH-TOKEN": userToken
        }
    })
    .then(res => res.json())
    .then(user => {
        document.querySelector("#welcome").textContent = Bienvenue,`${user.pseudo}` ;
    });
} 