
import { genererPagesModale } from './works.js';

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


async function adminModalDisplay () {
    const tokenValidation = window.localStorage.getItem("Token");
    const showModal = document.querySelector("#btn-modif");
    const modalDisplay = document.getElementById("modal-admin");

    showModal.addEventListener("click", function(event){
        event.preventDefault();
        modalDisplay.style.display = "flex";
        genererPagesModale(works);
    })

    const closeModalBtn = document.querySelector(".close-modal i");
    closeModalBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === modalDisplay) {
            closeModal();
        }
    });

    function closeModal() {
        modalDisplay.style.display = 'none';
    }
}

let works;

async function fetchWorks() {
    const reponse = await fetch("http://localhost:5678/api/works");
    works = await reponse.json();
}

await fetchWorks();
adminModalDisplay();