import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html",[],"/js/home.js"),
    new Route("/covoiturage", "Covoiturage", "/pages/covoiturage.html",[],"/js/covoiturage.js" ),
    new Route("/vueDetaileeCovoiturage","Vue détaillée du Covoiturage","/pages/vueDetaileeCovoiturage.html",[],"/js/vueDetaileeCovoiturage.js"),
    new Route("/signin"," Connection","/pages/auth/signin.html",["disconnected"],"/js/auth/signin.js"),  
    new Route("/signinup"," Inscription","/pages/auth/signinup.html",["disconnected"],"/js/auth/signup.js"), 
    new Route("/account", "Mon espace", "/pages/auth/account.html",["client"],"/js/profil.js"),
    new Route("/modifPassword", "Modifier mon mot de passe", "/pages/auth/modifPassword.html",["client"]),
    new Route("/conducteur"," Conducteur","/pages/utilisateurs/conducteur.html",["client","employer"],"js/conducteur.js"), 
    new Route("/passager"," Passager","/pages/utilisateurs/passager.html",["client","employer"],"/js/passager.js"), 
    new Route("/conducteurPassager","Conducteur et ou  Passager","/pages/utilisateurs/conducteurPassager.html",["client","employer"]),
    new Route("/admin-dashboard", "Tableau de bord Admin", "/pages/admin/dashboard.html", ["admin"], "/js/admin/dashboard.js"),
    new Route("/mentions-legales", "Mentions légales", "/pages/mentions-legales.html", []),
    new Route("/contact", "Contact", "/pages/contact.html", []),
    new Route("/debug", "Debug", "/pages/debug.html", [], "/js/debug.js"),

];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Eco Ride";