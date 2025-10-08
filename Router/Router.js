 // Importation de la classe Route et des données de configuration (routes et nom du site)
import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";


// Création d'une route spéciale pour la page 404 (non trouvée)
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Fonction utilitaire pour récupérer une route en fonction de l’URL actuelle
const getRouteByUrl = (url) => {
  // Redirection vers la racine si URL vide ou pointant vers /index.html
  if (url === "/" || url === "" || url === "/index.html") {
    return allRoutes.find(r => r.url === "/");
  }

  // Recherche d’une route correspondant à l’URL
  const route = allRoutes.find(r => r.url === url);
  // Si aucune correspondance trouvée, retourne la route 404
  return route || route404;
};

// Nettoyage des anciens tokens de connexion sauf sur la page de connexion
// Cela évite de rester "connecté" à cause de vieux tokens dans le localStorage
if (!window.location.pathname.includes("/signin")) {
  localStorage.removeItem("api_token");
  localStorage.removeItem("admin_token");
  localStorage.removeItem("user_role");
}

// Fonction principale de chargement dynamique de page (logique SPA)
const LoadContentPage = async () => {
  const path = window.location.pathname; // URL actuelle
  const actualRoute = getRouteByUrl(path); // Route correspondante

  const allRolesArray = actualRoute.authorize; // Rôles autorisés
  const roleUser = getRole(); // Rôle actuel de l’utilisateur

  // Vérification des autorisations d’accès à la page
  if (allRolesArray.length > 0) {
    // Redirection vers l’accueil si utilisateur connecté tente d’accéder à /signin
    if (allRolesArray.includes("disconnected") && isConnected()) {
      if (window.location.pathname !== "/") {
        window.location.replace("/");
        return;
      }
    }

    // Redirection si le rôle de l’utilisateur ne correspond pas aux rôles autorisés
    if (!allRolesArray.includes(getRole()) && !allRolesArray.includes("disconnected")) {
      window.location.replace("/");
      return;
    }
  }

  // Récupération du contenu HTML de la page
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // Insertion du HTML dans la zone principale de la page
  document.getElementById("main-page").innerHTML = html;

  // Si un script JS est associé à la page, on le charge dynamiquement
  if (actualRoute.pathJS != "") {
    let scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "module"); // Permet l’utilisation des imports/exports
    scriptTag.setAttribute("src", actualRoute.pathJS);
    document.querySelector("body").appendChild(scriptTag);
  }

  // Mise à jour du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  // Affichage conditionnel d’éléments selon le rôle utilisateur
  showAndHideElementsForRoles();
};

// Fonction appelée lors du clic sur un lien interne
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault(); // Empêche le comportement par défaut du lien
  window.history.pushState({}, "", event.target.href); // Met à jour l’URL sans recharger
  LoadContentPage(); // Charge la nouvelle page dynamiquement
};

// Événement déclenché lors des actions navigateur (précédent/suivant)
window.onpopstate = LoadContentPage;

// Raccourci utilisé dans le HTML avec data-url (ex : bouton "vers /profil")
window.route = function (e) {
  e.preventDefault();
  const url = e.currentTarget.dataset.url;
  console.log("Redirection vers :", url);
  if (url) {
    window.history.pushState({}, "", url);
    LoadContentPage();
  }
};

// Appel initial pour charger la page au premier affichage
LoadContentPage();

 