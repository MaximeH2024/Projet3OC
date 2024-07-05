const loginUrl = "http://localhost:5678/api/users/login";
const loginPayload = {
    username: "sophie.bluel@test.tld",
    password: "S0phie"
};


const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

console.log(travaux); 


function genererTravaux(travaux) {

    for (let i = 0; i < travaux.length; i++){
        const cartes = travaux[i]

        const sectionGallery = document.querySelector(".gallery");
        // Création de balise dédiée
        const figureElement = document.createElement("figure");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = cartes.imageUrl;
        imageElement.alt = cartes.title;
        const titleElement = document.createElement("figcaption");
        titleElement.textContent = cartes.title;
        
        // rattachement a la balise gallery
        sectionGallery.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(titleElement);
    }
}

genererTravaux(travaux);

// Création du menu contenant les fiddérentes catégories

const reponsecategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponsecategories.json();

console.log (categories);

function genererMenuCategorie(categories){

    
        const sectionMenu = document.querySelector("#portfolio");
        const menuCategorie = document.createElement("form");
        const selectMenu = document.createElement("select");
        selectMenu.id = "choixmenu";
        selectMenu.name = "categories";
        selectMenu.size = categories.length;
        selectMenu.multiple = true;
        const labelMenu = document.createElement("label");
        labelMenu.htmlFor = selectMenu.id
        labelMenu.innerText = "Choisissez vos options :"
        for (let i = 0; i < categories.length; i++) {
        const optionMenu = document.createElement("option");
        optionMenu.value = categories[i].name;
        optionMenu.innerText = categories[i].name;
        selectMenu.appendChild(optionMenu);
        }

        //rattachement
        sectionMenu.appendChild(menuCategorie);
        menuCategorie.appendChild(labelMenu);
        menuCategorie.appendChild(selectMenu);
        
    
}

genererMenuCategorie(categories);

