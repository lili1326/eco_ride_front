 // auth.js
export function setToken(token) {
    localStorage.setItem("api_token",token); // ✅ même nom que la colonne en BDD
  }
  
  export function getToken() {
    return localStorage.getItem("api_token");
  }
  
  export function logout() {
    localStorage.removeItem("api_token");
    document.cookie = "user_role=; Max-Age=0";
    window.location.href = "/signin";
  }