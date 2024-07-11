

export function errorDisplay(userAnswer){
    let errorMessage = "";
    console.log(userAnswer.status);
    switch (userAnswer.status) {
        case 401:    
        case 404:
          errorMessage = "Erreur dans l’identifiant ou le mot de passe";
          break;
        default:
          errorMessage = "Erreur inconnue";
      }

    const modalActivation = document.querySelector("#modal-error");
    let errorTxt = document.getElementById("error-msg");
    errorTxt.innerText = errorMessage;
    modalActivation.style.display = 'flex';
}