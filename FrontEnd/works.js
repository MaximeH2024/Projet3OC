import { genAddPagesModal } from "./modal.js";

const reponsecategories = await fetch("http://localhost:5678/api/categories");
const worksCat = await reponsecategories.json();

export { worksCat };

export function worksFilter(worksCat){
    const navAll = {
        id: 0,
        name: "Tous"
    }
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

        filterElement.addEventListener('click', function(){
            pageCreation(works, parseInt(this.dataset.categoryID));
        });
    });
}

worksFilter(worksCat);

const reponse = await fetch("http://localhost:5678/api/works");
let works = await reponse.json();

export function pageCreation(works, categoryId) {
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = '';

    works.forEach(cartes => {
        if (categoryId === 0 || cartes.categoryId === categoryId) {
            const figureElement = document.createElement("figure");
            figureElement.dataset.id = cartes.id;  // Ajouter l'ID de l'image

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

export function genPagesModal(works) {
    const modalDisplay = document.getElementById("modal-admin");
    const modalWrapper = document.querySelector(".modal-wrapper");

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

        closeModal.addEventListener('click', function() {
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

        addBtn.addEventListener("click", function(e){
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
        figureElement.dataset.id = cartes.id;  // Ajouter l'ID de l'image

        const imageElement = document.createElement("img");
        const logoElement = document.createElement("i");
        imageElement.src = cartes.imageUrl;
        imageElement.alt = cartes.title;
        logoElement.className = "fa-solid fa-trash";
        logoElement.ariaHidden = false;

        figureElement.appendChild(imageElement);
        sectionGallery.appendChild(figureElement);
        figureElement.appendChild(logoElement);
    });

    deleteWorks();  // Appeler deleteWorks après avoir généré les éléments
}

export function closeModal() {
    const modalDisplay = document.getElementById("modal-admin");
    
    if (modalDisplay) {
        console.log("je ferme ma modale")
        modalDisplay.style.display = 'none';
    }
}

export async function cleanStorage() {
    return new Promise((resolve) => {
        
        window.addEventListener('beforeunload', function() {
            // Marque un indicateur dans le sessionStorage
            sessionStorage.setItem('isRefreshing', 'true');
        });

        window.addEventListener('load', function() {
            if (sessionStorage.getItem('isRefreshing')) {
                // Si l'indicateur existe, c'est un rafraîchissement de la page
                sessionStorage.removeItem('isRefreshing');
                console.log('Page was refreshed');
                resolve();
            } else {
                // Si l'indicateur n'existe pas, c'est une nouvelle navigation
                console.log('New navigation or page opened');
                localStorage.removeItem('Token');
                resolve();
            }
        });
    });
}

async function deleteWork(id) {
    const token = localStorage.getItem('Token');  // Récupérer le token du localStorage
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Ajouter le token dans les en-têtes
        }
    });

    if (response.ok) {
        console.log(`Work with ID ${id} deleted`);
        works = works.filter(work => work.id !== id);  // Mettre à jour les données de works
        removeWorkFromGallery(id);  // Supprimer l'élément de la galerie principale
    } else {
        console.error(`Failed to delete work with ID ${id}`);
    }
}

function removeWorkFromGallery(id) {
    // Sélectionner et supprimer l'élément <figure> dans la galerie principale
    const figureElement = document.querySelector(`.gallery figure[data-id='${id}']`);
    if (figureElement) {
        figureElement.remove();
    }
}

function deleteWorks() {
    // Sélectionner tous les éléments <i> dans la classe gallery-modal
    const trashIcons = document.querySelectorAll('.gallery-modal figure i.fa-trash');
    console.log(trashIcons);

    // Ajouter un event listener à chaque icône de poubelle
    trashIcons.forEach(function(icon) {
        icon.addEventListener('click', async function(event) {
            // Action à effectuer lors du clic sur l'icône
            console.log('Icon clicked!', event.target);
            // Par exemple, supprimer le parent <figure>
            const figure = event.target.closest('figure');
            if (figure) {
                const id = figure.dataset.id;  // Récupérer l'ID de l'image
                await deleteWork(id);  // Appeler la fonction de suppression de l'API
                figure.remove();  // Supprimer l'élément de la modale
            }
        });
    });
}

export async function sendWork(title, categoryId, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('categoryId', categoryId);
    formData.append('image', file);

    const token = localStorage.getItem('Token'); // Assurez-vous d'avoir le token

    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` // Ajouter le token dans les en-têtes
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();
            console.log('New work added:', newWork);
            works.push(newWork); // Ajouter le nouveau travail à la galerie
            updateWorksGallery(newWork); // Mettre à jour l'interface utilisateur
            removeAndCloseModal(); // Fermer la modal et supprimer son contenu
        } else {
            const errorData = await response.json();
            console.error('Failed to add work:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateWorksGallery(newWork) {
    // Logique pour mettre à jour l'interface utilisateur avec le nouveau travail ajouté
    const gallery = document.getElementById('works-gallery');
    const workElement = document.createElement('div');
    workElement.className = 'work-item';
    workElement.innerHTML = `
        <img src="${newWork.imageUrl}" alt="${newWork.title}">
        <p>${newWork.title}</p>
    `;
    gallery.appendChild(workElement);
}

function removeAndCloseModal() {
    const modalDisplay = document.getElementById("modal-admin");
    const modalWrapper = document.querySelector(".modal-wrapper");
    modalWrapper.innerHTML = "";
    modalDisplay.style.display = 'none';
}


pageCreation(works, 0);
genPagesModal(works);
