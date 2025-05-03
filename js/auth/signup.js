 
//Implémenter le JS de ma page

const inputPseudo = document.getElementById("PseudoInput");
const inputNom = document.getElementById("NomInput");
const inputPreNom = document.getElementById("PrenomInput");
const inputMail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const inputValidationPassword = document.getElementById("ValidatePasswordInput");
const btnValidation =document.getElementById("btn-validation-inscription");


inputPseudo.addEventListener("keyup", validateForm); //validate Form =fonction
inputPreNom.addEventListener("keyup", validateForm);
inputMail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);
inputValidationPassword.addEventListener("keyup", validateForm);

//Function permettant de valider tout le formulaire
function validateForm(){
    const pseudoOk=validateRequired(inputPseudo);// fonction validateRequired
    const nomOk = validateRequired(inputNom);
    const prenomOk=validateRequired(inputPreNom);
    const mailOk=validateMail(inputMail);
    const passwordOk =validatePassword(inputPassword);
    const passwordConfirmOk=validateConfirmationPassword(inputPassword,inputValidationPassword)

    //si les champs ne sont pas valides le btn incription n est pas clikable
    if (pseudoOk && prenomOk && nomOk && mailOk && passwordOk && passwordConfirmOk) {
        btnValidation.disabled =false;
    }else{
        btnValidation.disabled = true;
    }
}

function validateRequired(input){
    if(input.value != ''){//différente d'un champ vide
        input.classList.add("is-valid");//class bootstrap pour valider un champ
        input.classList.remove("is-invalid"); 
        return  true;//pour  récuperer la valeur
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

//  MAIL si imput respect  le regex 
function validateMail(input){
    //Définir mon regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value;//je récupére le mail utilisateur
    if(mailUser.match(emailRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

//  MDP si imput respect  le regex 
function validatePassword(input){
    //Définir mon regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const passwordUser = input.value;
    if(passwordUser.match(passwordRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

//vérif si input passeword est égale a input password
function validateConfirmationPassword(inputPwd, inputConfirmPwd){
    if(inputPwd.value == inputConfirmPwd.value){
        inputConfirmPwd.classList.add("is-valid");
        inputConfirmPwd.classList.remove("is-invalid");
        return true;
    }
    else{
        inputConfirmPwd.classList.add("is-invalid");
        inputConfirmPwd.classList.remove("is-valid");
        return false;
    }
}

btnValidation.addEventListener("click", async (e) => {
    e.preventDefault();

    const payload = {
        firstName: inputPreNom.value,
        lastName:inputNom.value,  
        pseudo: inputPseudo.value,
        email: inputMail.value,
        password: inputPassword.value
    };

    try {
        const response = await fetch("http://localhost:8000/api/registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.status === 201) {
            alert("Inscription réussie !"); // Rediriger vers la page de connexion après 1 seconde
            setTimeout(() => {
                window.location.href = "/signin";
            }, 1000);
            console.log("Token :", result.apiToken);
            // localStorage.setItem("token", result.apiToken); // facultatif
            // window.location.href = "/signin"; // redirige vers connexion
        } else {
            alert("Erreur lors de l'inscription : " + (result.message || "Inconnue"));
            console.log(result);
        }
    } catch (error) {
        console.error("Erreur serveur :", error);
        alert("Erreur de connexion au serveur");
    }
});

