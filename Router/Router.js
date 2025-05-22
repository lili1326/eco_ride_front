 import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Route 404
const route404 = new Route("404", "Page introuvable", "/pages/404.html", []);

// Trouver une route à partir de l’URL
const getRouteByUrl = (url) => {
  if (url === "/" || url === "" || url === "/index.html") {
    return allRoutes.find(r => r.url === "/");
  }

  const route = allRoutes.find(r => r.url === url);
  return route || null;
};

// Chargement d'une page
const LoadContentPage = async () => {
  const path = window.location.pathname;
  console.log(" Path demandé :", path);
  let actualRoute = getRouteByUrl(path);
  console.log(" Route trouvée :", actualRoute);

  console.log(" Token localStorage :", localStorage.getItem("api_token"));
console.log("👤 Rôle localStorage :", localStorage.getItem("user_role"));

  //  Si route non trouvée → forcer la home
  if (!actualRoute) {
    console.warn("Route inconnue, redirection vers /");
    window.history.replaceState({}, "", "/");
    actualRoute = getRouteByUrl("/");
  }
  

  //  Vérification des autorisations
  const allRolesArray = actualRoute.authorize;
  if (allRolesArray.length > 0) {
    if (allRolesArray.includes("disconnected")) {
      if (isConnected()) {
        window.location.replace("/");
        return;
      }
    } else {
      const roleUser = getRole();
      if (!allRolesArray.includes(roleUser)) {
        window.location.replace("/");
        return;
      }
    }
  }

  //  Chargement HTML
  const html = await fetch(actualRoute.pathHtml).then(res => res.text());
  document.getElementById("main-page").innerHTML = html;

  //  Chargement JS si défini
  if (actualRoute.pathJS) {
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "module");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    document.body.appendChild(scriptTag);
  }

  //  Titre de la page
  document.title = actualRoute.title + " - " + websiteName;

  //  Affichage conditionnel
  showAndHideElementsForRoles();
};

// Gestion des clics sur liens internes
const routeEvent = (event) => {
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  LoadContentPage();
};

window.onpopstate = LoadContentPage;

window.route = function (e) {
  e.preventDefault();
  const url = e.currentTarget.dataset.url;
  if (url) {
    window.history.pushState({}, "", url);
    LoadContentPage();
  }
};

//  Chargement initial
LoadContentPage();
