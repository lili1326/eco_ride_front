const pseudoInput = document.getElementById("PseudoInput");
const mailInput =document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSingin = document.getElementById("btnSignin");

btnSingin.addEventListener("click", checkCredentials);//information de connection

function checkCredentials(){
 
    //Ici, il faudra appeler l'API pour vérifier les credentials en BDD
  
    if(mailInput.value == "test@mail.com" && passwordInput.value == "123"){
      if(pseudoInput.value === "lili"){
       
        //Il faudra récupérer le vrai token
        const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
        setToken(token);
        //placer ce token en cookie
        setCookie(RoleCookieName, "client", 7);
        window.location.replace("/account"); 
      }else{
          pseudoInput.classList.add("is-invalid");
      }  
  }else{
        
        mailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }}

  
   