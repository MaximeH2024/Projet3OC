export function authentication(){
    const loginElement = document.querySelector('.login');

    loginElement.addEventListener('click', function(){
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = "";
        const blockLogin = document.createElement("div");
        blockLogin.className = "login";
        const titleLogin = document.createElement("h3");
        titleLogin.innerText = "Log in";
        const blockInput = document.createElement("div");
        blockInput.className = "zone-input"
        const textLogin1 = document.createElement("p");
        textLogin1.innerText = "E-mail";
        const inputLogin1 = document.createElement("input");

        const textLogin2 = document.createElement("p");
        textLogin2.innerText = "Mot de passe";
        const inputLogin2 = document.createElement("input");
        inputLogin2.type = "password";

        const connectionLogin = document.createElement("div");
        connectionLogin.innerText = "Se connecter";
        connectionLogin.className = "connection"

        const forgottenPassword = document.createElement("p");
        forgottenPassword.innerText = "Mot de passe oublié";
        forgottenPassword.className = "mdp-oublie"

        mainElement.appendChild(blockLogin);
        blockLogin.appendChild(titleLogin);

        blockLogin.appendChild(blockInput);
        blockInput.appendChild(textLogin1);
        blockInput.appendChild(inputLogin1);

        blockInput.appendChild(textLogin2);
        blockInput.appendChild(inputLogin2);

        blockLogin.appendChild(connectionLogin);

        blockLogin.appendChild(forgottenPassword);
    });
    
}

export function homePage(){
    const homePageElement = document.querySelector('.accueil');

    homePageElement.addEventListener('click', function(){
        genererMenu(worksCat);
        genererPages(works,0);
    });
}