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