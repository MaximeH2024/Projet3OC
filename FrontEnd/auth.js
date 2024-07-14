const userInfo = document.getElementById("login-form");
userInfo.addEventListener("submit", function(event){
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("pwd").value.trim();

    const logInInfo = {
        email: email,
        password: password,
    }
    logInCheck(logInInfo);
});

async function logInCheck(logInInfo) {
    try {
        const userAnswer = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(logInInfo),  
        });

        if (!userAnswer.ok) {
            errorDisplay(userAnswer);
        }
        else {
        const user = await userAnswer.json();
        console.log(user);
        window.localStorage.setItem("Token", user.token);
        window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function errorDisplay(userAnswer){
    let errorMessage = "";
    console.log(userAnswer.status);
    switch (userAnswer.status) {
        case 401:    
            errorMessage = "Erreur dans l’identifiant ou le mot de passe"
        break;
        case 404:
          errorMessage = "Compte Inexistant";
        break;
        default:
          errorMessage = "Erreur inconnue";
      }

    const modalActivation = document.querySelector("#modal-error");
    let errorTxt = document.getElementById("error-msg");
    errorTxt.innerText = errorMessage;
    modalActivation.style.display = 'flex';

    const closeModalBtn = document.querySelector(".close-modal i");
    closeModalBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === modalActivation) {
            closeModal();
        }
    });

    function closeModal() {
        modalActivation.style.display = 'none';
    }
}