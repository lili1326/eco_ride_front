 // auth.admin.js

 // 1. Sauvegarde du token admin
export function setAdminToken(token) {
    localStorage.setItem("admin_token", token);
}

// 2. Récupération du token admin
export function getAdminToken() {
    return localStorage.getItem("admin_token");
}
 // 3. Vérification de la connexion
export function isConnected() {
  return !!localStorage.getItem("admin_token");
}
// 4. Déconnexion admin
export function logoutAdmin() {
    localStorage.removeItem("admin_token");
    document.cookie = "admin_role=; Max-Age=0";
    window.location.href = "/signin";  
}
 
