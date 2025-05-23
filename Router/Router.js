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

const LoadContentPage = async () => {
  const path = window.location.pathname;
  const actualRoute = getRouteByUrl(path);

  const authorizedRoles = actualRoute.authorize;

  // Si la page est protégée
  if (authorizedRoles.length > 0) {
    const role = getRole(); // admin, client, null

    // Si la page est réservée aux déconnectés
    if (authorizedRoles.includes("disconnected")) {
      if (isConnected()) {
        return window.location.replace("/"); // redirige vers accueil
      }
    }

    // Si la page est réservée à un rôle spécifique
    else if (!authorizedRoles.includes(role)) {
      return window.location.replace("/signin"); // redirige vers login
    }
  }

  // Chargement du HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((res) => res.text());
  document.getElementById("main-page").innerHTML = html;

  // Chargement du JS associé
  if (actualRoute.pathJS !== "") {
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "module");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    document.querySelector("body").appendChild(scriptTag);
  }

  // Mise à jour du titre de la page
  document.title = `${actualRoute.title} - ${websiteName}`;

  // Mise à jour des éléments en fonction du rôle
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
