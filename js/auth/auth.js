 // auth.js

export function setToken(token) {
  localStorage.setItem("api_token", token);
}

export function getToken() {
  return localStorage.getItem("api_token");
}

export function isConnected() {
  return !!localStorage.getItem("api_token");
}

export function logout() {
  localStorage.removeItem("api_token");
  localStorage.removeItem("user_role");
  window.location.href = "/signin";
}

export function getRole() {
  return localStorage.getItem("user_role");
}

export function setRole(role) {
  localStorage.setItem("user_role", role);
}
