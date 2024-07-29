// Importation des fonctions depuis modal.js
import { genAddPagesModal } from "./modal.js";

// Récupération des catégories depuis l'API
const reponsecategories = await fetch("http://localhost:5678/api/categories");
const worksCat = await reponsecategories.json();

export { worksCat };

// Fonction pour filtrer les travaux par catégorie
export function worksFilter(worksCat) {
    const navAll = {
        id: 0,
        name: "Tous"
    };
    const filterSet = new Set([navAll]);

    worksCat.forEach(category => {
        filterSet.add(category);
    });

    const menuFilter = Array.from(filterSet);

    const sectionFilter = document.querySelector(".categories");
    menuFilter.forEach(category => {
        const filterElement = document.createElement("div");
        filterElement.className = "filter";
        filterElement.innerText = category.name;
        filterElement.dataset.categoryID = category.id;
        sectionFilter.appendChild(filterElement);

        filterElement.addEventListener('click', function () {
            pageCreation(works, parseInt(this.dataset.categoryID));
        });
    });
}

// Appeler la fonction worksFilter pour initialiser les filtres de catégorie
worksFilter(worksCat);

// Récupération des travaux depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
let works = await reponse.json();

// Fonction pour créer et afficher les travaux sur la page
export function pageCreation(works, categoryId) {
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = '';

    works.forEach(cartes => {
        if (categoryId === 0 || cartes.categoryId === categoryId) {
            const figureElement = document.createElement("figure");
            figureElement.dataset.id = cartes.id;

            const imageElement = document.createElement("img");
            imageElement.src = cartes.imageUrl;
            imageElement.alt = cartes.title;
            const titleElement = document.createElement("figcaption");
            titleElement.textContent = cartes.title;

            figureElement.appendChild(imageElement);
            figureElement.appendChild(titleElement);
            sectionGallery.appendChild(figureElement);
        }
    });
}

// Fonction pour générer et afficher la modale de galerie
export function genPagesModal(works) {
    const modalDisplay = document.getElementById("modal-admin");
    const modalWrapper = document.querySelector(".modal-wrapper");

    modalWrapper.innerHTML = "";

    let closeModal = modalWrapper.querySelector('.close-modal');
    let title = modalWrapper.querySelector('#title-modal');
    let addBtn = modalWrapper.querySelector('.add-picture-btn');
    let sectionGallery = modalWrapper.querySelector(".gallery-modal");

    if (!closeModal && !title && !addBtn) {
        closeModal = document.createElement('div');
        closeModal.classList.add('close-modal');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark');
        closeModal.appendChild(closeIcon);
        modalWrapper.appendChild(closeModal);

        closeModal.addEventListener('click', function (event) {
            event.preventDefault();
            modalDisplay.style.display = 'none';
        });

        title = document.createElement('h4');
        title.id = 'title-modal';
        title.innerText = 'Galerie Photo :';
        modalWrapper.appendChild(title);

        addBtn = document.createElement("div");
        const addBtnText = document.createElement("p");
        addBtn.className = "add-picture-btn";
        addBtnText.innerText = "Ajouter une photo";
        addBtn.appendChild(addBtnText);
        modalWrapper.appendChild(addBtn);

        addBtn.addEventListener("click", function (e) {
            e.preventDefault();
            modalWrapper.innerHTML = "";
            genAddPagesModal();
        });
    }

    if (!sectionGallery) {
        sectionGallery = document.createElement('div');
        sectionGallery.classList.add('gallery-modal');
        modalWrapper.insertBefore(sectionGallery, addBtn);
    } else {
        sectionGallery.innerHTML = '';
    }

    works.forEach(cartes => {
        const figureElement = document.createElement("figure");
        figureElement.dataset.id = cartes.id;

        const imageElement = document.createElement("img");
        const logoElement = document.createElement("i");
        imageElement.src = cartes.imageUrl;
        imageElement.alt = cartes.title;
        logoElement.className = "fa-solid fa-trash-can";
        logoElement.ariaHidden = false;

        figureElement.appendChild(imageElement);
        sectionGallery.appendChild(figureElement);
        figureElement.appendChild(logoElement);
    });

    deleteWorks();
}

// Fonction pour fermer la modale
export function closeModal() {
    const modalDisplay = document.getElementById("modal-admin");

    if (modalDisplay) {
        console.log("je ferme ma modale");
        modalDisplay.style.display = 'none';
    }
}

// Fonction pour basculer entre le login et le logout
export function toggleLoginLogout() {
    const loginBtn = document.getElementById('login-btn');
    const token = localStorage.getItem('Token');

    if (token) {
        loginBtn.innerText = 'logout';
        loginBtn.addEventListener('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('Token');
            window.location.href = 'index.html'; // Rediriger vers index.html
        });
    } else {
        loginBtn.innerText = 'login';
        loginBtn.href = 'login.html';
    }
}

// Fonction pour supprimer un travail par ID
async function deleteWork(id) {
    const token = localStorage.getItem('Token');
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        console.log(`Work with ID ${id} deleted`);
        works = works.filter(work => work.id !== id);
        removeWorkFromGallery(id);
        removeWorkFromModalGallery(id);
        
        // Mettre à jour la galerie modale
        genPagesModal(works);

        // Fermer la modale
        closeModal();
    } else {
        console.error(`Failed to delete work with ID ${id}`);
    }
}

// Fonction pour supprimer un travail de la galerie principale
function removeWorkFromGallery(id) {
    const figureElement = document.querySelector(`.gallery figure[data-id='${id}']`);
    if (figureElement) {
        figureElement.remove();
    }
}

// Fonction pour supprimer un travail de la galerie modale
function removeWorkFromModalGallery(id) {
    const figureElement = document.querySelector(`.gallery-modal figure[data-id='${id}']`);
    if (figureElement) {
        figureElement.remove();
    }
}

// Fonction pour ajouter des écouteurs d'événements aux icônes de poubelle dans la galerie modale
function deleteWorks() {
    const trashIcons = document.querySelectorAll('.gallery-modal figure i.fa-trash-can');

    trashIcons.forEach(function (icon) {
        icon.addEventListener('click', async function (event) {
            const figure = event.target.closest('figure');
            if (figure) {
                const id = figure.dataset.id;
                await deleteWork(id);
            }
        });
    });
}

// Fonction pour envoyer un nouveau travail à l'API
export async function sendWork(title, categoryId, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', categoryId); 
    formData.append('image', file);
    
    const token = localStorage.getItem('Token');
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();
            console.log('New work added:', newWork);

            // Mettre à jour le tableau works et la page
            works.push(newWork);
            pageCreation(works, 0);

            // Mettre à jour la galerie modale
            genPagesModal(works);
            
            // Fermer la modale
            closeModal();
        } else {
            const errorData = await response.json();
            console.error('Failed to add work:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialiser la page et la galerie modale avec les travaux existants
pageCreation(works, 0);
genPagesModal(works);
toggleLoginLogout();
