import "./auth.js"


const reponsecategories = await fetch("http://localhost:5678/api/categories");
const worksCat = await reponsecategories.json();

function genererMenu(worksCat){
    const navTous = {
        id: 0,
        name: "Tous"
    }
    const filterAll = [navTous];

    for (let key in worksCat){
        if (worksCat.hasOwnProperty(key)) {
            filterAll.push(worksCat[key]);
        }
    }
    
    const menuFilter = filterAll;

    const sectionFilter = document.querySelector(".categories");
    for (let i = 0; i < menuFilter.length; i++){
        const filterElement = document.createElement("div");
        filterElement.className = "filter";
        filterElement.innerText = menuFilter[i].name;
        //a approfondir 
        filterElement.dataset.categoryID = menuFilter[i].id;
        sectionFilter.appendChild(filterElement);

        filterElement.addEventListener('click', function(){
            genererPages(works, this.dataset.categoryID);
        })
    }
            
}

genererMenu(worksCat);

const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();


function genererPages(works, categoryId) {
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = '';

    for (let i = 0; i < works.length; i++) {
        const cartes = works[i];

        // Filtrer par catégorie
        if (categoryId == 0 || cartes.categoryId == categoryId) {
            const figureElement = document.createElement("figure");

            const imageElement = document.createElement("img");
            imageElement.src = cartes.imageUrl;
            imageElement.alt = cartes.title;
            const titleElement = document.createElement("figcaption");
            titleElement.textContent = cartes.title;

            sectionGallery.appendChild(figureElement);
            figureElement.appendChild(imageElement);
            figureElement.appendChild(titleElement);
        }
    }
}
genererPages(works,0);





