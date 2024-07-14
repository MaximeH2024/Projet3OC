
async function editDisplay () {
    const tokenValidation = window.localStorage.getItem("Token");

    const modEdition = document.getElementById("edit-mod");
    const modModif = document.getElementById("btn-modif");
    
    if (modEdition && tokenValidation && modModif) {

        modEdition.style.display = 'flex';
        modModif.style.display = 'flex';

    }

}

editDisplay();
