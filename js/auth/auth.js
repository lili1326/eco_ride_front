 // auth.js

  // 1. Sauvegarde du token dans localStorage
export function setToken(token) {
    localStorage.setItem("api_token",token);  
  }

  // 2. Récupération du token pour l'utiliser (ex: requêtes API)
  export function getToken() {
    return localStorage.getItem("api_token");
  }
 
// 3. Déconnexion : suppression du token
  export function logout() {
    localStorage.removeItem("api_token");// Supprime le token
    document.cookie = "user_role=; Max-Age=0";// Supprime le rôle stocké en cookie
    window.location.href = "/signin";// Redirige vers la page de connexion
  }
