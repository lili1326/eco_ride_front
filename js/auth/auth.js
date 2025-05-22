 

 // 1. Sauvegarde du token dans localStorage
export function setToken(token) {
    localStorage.setItem("api_token",token);  
  }

  // 2. Récupération du token pour l'utiliser (ex: requêtes API)
  export function getToken() {
    return localStorage.getItem("api_token");
  }
  
  // 3. Vérification de la connexion
export function isConnected() {
  return !!localStorage.getItem("api_token");
}
// 4. Déconnexion : suppression du token
  export function logout() {
    localStorage.removeItem("api_token");
    document.cookie = "user_role=; Max-Age=0";
    window.location.href = "/signin";
  }