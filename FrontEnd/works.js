const reponsecategories = await fetch("http://localhost:5678/api/categories");
const worksCat = await reponsecategories.json();

function generateWork(worksCat){
    const navAll = {
        id: 0,
        name: "Tous"
    }
    const filterSet = new Set([navAll]);

    worksCat.forEach(category => {
        filterSet.add(category);
    });

    console.log(filterSet);
    
    const menuFilter = Array.from(filterSet);

    const sectionFilter = document.querySelector(".categories");
    menuFilter.forEach(category => {
        const filterElement = document.createElement("div");
        filterElement.className = "filter";
        filterElement.innerText = category.name;
        filterElement.dataset.categoryID = category.id;
        sectionFilter.appendChild(filterElement);

        filterElement.addEventListener('click', function(){
            genererPages(works, parseInt(this.dataset.categoryID));
        });
    });
}

generateWork(worksCat);

const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

function genererPages(works, categoryId) {
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

genererPages(works, 0);