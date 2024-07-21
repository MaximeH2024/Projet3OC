
import { genAddPagesModal } from "./modal.js";

const reponsecategories = await fetch("http://localhost:5678/api/categories");
const worksCat = await reponsecategories.json();

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
const works = await reponse.json();

export function pageCreation(works, categoryId) {
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = '';

    works.forEach(cartes => {
        if (categoryId === 0 || cartes.categoryId === categoryId) {
            const figureElement = document.createElement("figure");

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

pageCreation(works, 0);
