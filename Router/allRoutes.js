import Route from "./Route.js";

//Définir ici vos routes
export const allRoutes = [
    new Route("/", "Accueil", "/pages/home.html",[]),
    new Route("/covoiturage", "Covoiturage", "/pages/covoiturage.html",[],"/js/covoiturage.js"),
    new Route("/vueDetaileeCovoiturage","Vue détaillée du Covoiturage","/pages/vueDetaileeCovoiturage.html",[]),
    new Route("/signin"," Connection","/pages/auth/signin.html",["disconnected","client"],"/js/auth/signin.js"),  
    new Route("/signinup"," Inscription","/pages/auth/signinup.html",["disconnected"],"/js/auth/signup.js"), 
    new Route("/account", "Mon espace", "/pages/auth/account.html",["client"], "/js/profil.js"),
    new Route("/modifPassword", "Modifier mon mot de passe", "/pages/auth/modifPassword.html",["client"]),
    new Route("/conducteur"," Conducteur","/pages/utilisateurs/conducteur.html",["client","employer"],"js/conducteur.js"), 
    new Route("/passager"," Passager","/pages/utilisateurs/passager.html",["client","employer"]), 
    new Route("/conducteurPassager","Conducteur et ou  Passager","/pages/utilisateurs/conducteurPassager.html",["client","employer"]),

];

//Le titre s'affiche comme ceci : Route.titre - websitename
export const websiteName = "Eco Ride";