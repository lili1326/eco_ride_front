
 // Ne forcer la déconnexion qu'une seule fois au tout début du site
//if (!sessionStorage.getItem("hasForcedLogout")) {
//  localStorage.removeItem("api_token");
 // localStorage.removeItem("admin_token");
 // localStorage.removeItem("user_role");
 // sessionStorage.setItem("hasForcedLogout", "true");
//}


import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";



// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/pages/404.html",[]);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
   // Rediriger vers "/" si url vide ou "/index.html"
   if (url === "/" || url === "" || url === "/index.html") {
    return allRoutes.find(r => r.url === "/");
  }

  const route = allRoutes.find(r => r.url === url);
  return route || route404;
};

//  pour éviter d’être considéré "connecté" si un vieux token traîne
if (!window.location.pathname.includes("/signin")) {
  localStorage.removeItem("api_token");
  localStorage.removeItem("admin_token");
  localStorage.removeItem("user_role");
}

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  // Récupération de l'URL actuelle
  const actualRoute = getRouteByUrl(path);
  // Récupération du contenu HTML de la route

  
  // Empêche d'accéder à une route protégée sans être connecté
const allRolesArray = actualRoute.authorize;
const roleUser = getRole();

if (allRolesArray.length > 0) {
  if (allRolesArray.includes("disconnected") && isConnected()) {
    console.log(actualRoute)
    window.location.replace("/");
    return;
  }

  if (!allRolesArray.includes(roleUser)) {
    // Si la route est protégée par un rôle et que l'utilisateur n'a pas ce rôle
    window.location.replace("/");
    return;
  }
} 
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  // Ajout du contenu HTML à l'élément avec l'ID "main-page"
  document.getElementById("main-page").innerHTML = html;

  // Ajout du contenu JavaScript
  if (actualRoute.pathJS != "") {
    // Création d'une balise script
    let scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "module"); // obligatoire pour utiliser import/export
    scriptTag.setAttribute("src", actualRoute.pathJS);

    // Ajout de la balise script au corps du document
    document.querySelector("body").appendChild(scriptTag);
  }

  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  // Afficher et masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
};
 
 


// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();
  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", event.target.href);
  // Chargement du contenu de la nouvelle page
  LoadContentPage();
};



// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;

// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = function (e) {
  e.preventDefault();
  const url = e.currentTarget.dataset.url;
  console.log("Redirection vers :", url);
  if (url) {
    window.history.pushState({}, "", url);
    LoadContentPage();
  }
};




// Chargement du contenu de la page au chargement initial
LoadContentPage();
