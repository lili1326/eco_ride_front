  
 
 
 //stocker en cookie notre token
const tokenCookieName = "accesstoken";
const RoleCookieName ="role"; 
 
 
 // DECONNECTION
 document.addEventListener("DOMContentLoaded", () => {
  const signoutBtn = document.getElementById("signout-btn");

  if (signoutBtn) {
    signoutBtn.addEventListener("click", (e) => {
      e.preventDefault(); // évite rechargement ou navigation

      // Supprimer token et rôle
      localStorage.removeItem("api_token");
      localStorage.removeItem("user_role");

      // Recalculer l'affichage de la nav
      showAndHideElementsForRoles();

      // Redirection vers la page d’accueil ou connexion
      window.location.href = "/";
    });
  }
});
 

 function signout(){
    eraseCookie(tokenCookieName);
    eraseCookie(RoleCookieName);
    showAndHideElementsForRoles();
  window.location.reload();
}




 //role
  function getRole() {
  const role = localStorage.getItem("user_role");
  console.log("Role détecté :", role);
  return role;
}

//méthode de gestion de cookies placer -récupére-supprimé

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}



function setToken(token){
    setCookie(tokenCookieName,token, 7);
}

//function getToken(){
 //   return getCookie(tokenCookieName);
//}

function getToken() {
    return localStorage.getItem("api_token") || getCookie(tokenCookieName);
}


//si nous sommes connectés ou non.
 function isConnected() {
    const token = getToken();
  return token !== null && token !== "";
}

 

 /*
avec data attribut en index.html
disconnect
connected (admid ou client)
  admin
  client
*/

 function showAndHideElementsForRoles(){
 
    const userConnected = isConnected();
    const role = getRole();

    let allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element => {
        // Toujours commencer par rendre visible
        element.classList.remove("d-none");

        switch(element.dataset.show){
            case 'disconnected': 
                if(userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'connected': 
                if(!userConnected){
                    element.classList.add("d-none");
                }
                break;
            case 'admin': 
                if(!userConnected || role !== "admin"){
                    element.classList.add("d-none");
                }
                break;
            case 'user': 
                if(!userConnected || role !== "user"){
                    element.classList.add("d-none");
                }
                break;
        }
    });
    
console.log("🔍 isConnected:", isConnected());
console.log("🔍 Role:", getRole());
}

 

function sanitiezHtml(text){
    const tempHtml = document.createElement('div');
    tempHtml.textContent = text;
    return tempHtml.innerHTML;
} 

function getInfosUser(){
    
    
    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(apiUrl+"account/me", requestOptions)
    .then(response =>{
        if(response.ok){
            return response.json();
        }
        else{
            console.log("Impossible de récupérer les informations utilisateur");
        }
    })
    .then(result => {
       // console.log(result);
       return result;
    })
    .catch(error =>{
        console.error("erreur lors de la récupération des données utilisateur", error);
    });
}

 