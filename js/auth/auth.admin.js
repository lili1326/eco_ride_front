 // auth.admin.js

export function setAdminToken(token) {
  localStorage.setItem("admin_token", token);
}

export function getAdminToken() {
  return localStorage.getItem("admin_token");
}

export function logoutAdmin() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("user_role");
  window.location.href = "/signin";
}
