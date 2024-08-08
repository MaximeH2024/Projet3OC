// Importation des fonctions depuis works.js et modalState.js
import { genPagesModal } from './works.js';
import { closeModal } from './works.js';
import { worksCat } from './works.js';
import { sendWork } from './works.js';
import { openModal } from './modalState.js';

let works;

// Fonction pour récupérer les travaux depuis l'API
async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
}
await fetchWorks();

// Fonction pour afficher les options d'édition si le token est valide
function editDisplay() {
    const tokenValidation = window.localStorage.getItem("Token");

    const modEdition = document.getElementById("edit-mod");
    const modModif = document.getElementById("btn-modif");
    if (modEdition && tokenValidation && modModif) {
        modEdition.style.display = 'flex';
        modModif.style.display = 'flex';
    }
}

// Fonction pour afficher la modale d'administration
async function adminModalDisplay() {
    const showModal = document.querySelector("#btn-modif");
    const modalDisplay = document.getElementById("modal-admin");

    if (showModal && modalDisplay) {
        showModal.addEventListener("click", async function(event) {
            event.preventDefault();
            await fetchWorks(); // S'assurer que le tableau works est à jour
            genPagesModal(works); // Mettre à jour la galerie modale lors de l'ouverture de la modale
            openModal();
        });

        window.addEventListener('click', function(event) {
            if (event.target === modalDisplay) {
                event.preventDefault();
                closeModal();
            }
        });
    }
}

// Fonction pour générer la modale d'ajout de travaux
export function genAddPagesModal() {
    const modalDisplay = document.getElementById("modal-admin");
    const wrapperSelection = document.querySelector(".modal-wrapper");

    const headerModal = document.createElement("div");
    headerModal.className = "header-modal";
    const goBackModal = document.createElement("i");
    goBackModal.className = "fa-solid fa-arrow-left";
    const closeModal = document.createElement("i");
    closeModal.className = "fa-solid fa-xmark";

    const titleModal = document.createElement("h4");
    titleModal.innerText = "Ajout photo";

    headerModal.appendChild(goBackModal);
    headerModal.appendChild(closeModal);

    // Création du conteneur de formulaire
    const formContainer = document.createElement("div");
    formContainer.className = "form-container";

    // Création de la section image-upload
    const imageUpload = document.createElement("div");
    imageUpload.className = "image-upload";

    const fileInputLabel = document.createElement("label");
    fileInputLabel.setAttribute("for", "file-input");

    const uploadPlaceholder = document.createElement("div");
    uploadPlaceholder.className = "upload-placeholder";

    const placeholderIcon = document.createElement("i");
    placeholderIcon.className = "fa-regular fa-image";

    const addPhotoText = document.createElement("span");
    addPhotoText.innerText = "+ Ajouter photo";

    const fileSizeText = document.createElement("p");
    fileSizeText.innerText = "jpg, png : 4mo max";

    const fileInput = document.createElement("input");
    fileInput.id = "file-input";
    fileInput.type = "file";
    fileInput.accept = ".jpg, .jpeg, .png";
    fileInput.style.display = "none";

    // Créer l'élément de prévisualisation de l'image
    const imagePreview = document.createElement("img");
    imagePreview.className = "image-preview";
    imagePreview.style.display = "none";

    // Ajouter des éléments à la section imageUpload
    uploadPlaceholder.appendChild(placeholderIcon);
    uploadPlaceholder.appendChild(addPhotoText);
    uploadPlaceholder.appendChild(fileSizeText);
    uploadPlaceholder.appendChild(imagePreview); // Ajouter l'image de prévisualisation à la section de téléchargement

    fileInputLabel.appendChild(uploadPlaceholder);
    imageUpload.appendChild(fileInputLabel);
    imageUpload.appendChild(fileInput);

    // Création du champ de titre
    const titleField = document.createElement("div");
    titleField.className = "form-field";

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.innerText = "Titre";

    const titleInput = document.createElement("input");
    titleInput.id = "title";
    titleInput.type = "text";

    // Ajouter des éléments au champ de titre
    titleField.appendChild(titleLabel);
    titleField.appendChild(titleInput);

    // Création du champ de catégorie
    const categoryField = document.createElement("div");
    categoryField.className = "form-field";

    const categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for", "category");
    categoryLabel.innerText = "Catégorie";

    const categorySelect = document.createElement("select");
    categorySelect.id = "category";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.innerText = "Sélectionner une catégorie";
    categorySelect.appendChild(defaultOption);

    // Remplir le select de catégorie avec les options de worksCat
    worksCat.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.innerText = category.name;
        categorySelect.appendChild(option);
        console.log(`Option ajoutée : valeur=${option.value}, texte=${option.innerText}`);
    });

    // Ajouter des éléments au champ de catégorie
    categoryField.appendChild(categoryLabel);
    categoryField.appendChild(categorySelect);

    // Ajouter toutes les sections au conteneur de formulaire
    formContainer.appendChild(imageUpload);
    formContainer.appendChild(titleField);
    formContainer.appendChild(categoryField);

    // Création de la zone d'envoi
    const submitArea = document.createElement("div");
    submitArea.className = "submit-area";

    // Création du bouton d'envoi
    const submitButton = document.createElement("p");
    submitButton.className = "submit-button";
    submitButton.innerText = "Valider";

    // Ajouter des éléments au wrapper
    wrapperSelection.appendChild(headerModal);
    wrapperSelection.appendChild(titleModal);
    wrapperSelection.appendChild(formContainer);
    wrapperSelection.appendChild(submitArea);
    submitArea.appendChild(submitButton);

    // Ajouter un écouteur d'événement pour fermer la modale
    closeModal.addEventListener('click', function (event) {
        event.preventDefault();
        modalDisplay.style.display = 'none';
    });

    // Ajouter un écouteur d'événement pour revenir en arrière
    goBackModal.addEventListener('click', function (event) {
        event.preventDefault();
        wrapperSelection.innerHTML = "";
        genPagesModal(works);
    });

    // Fonction pour vérifier la validité du formulaire
    function checkFormValidity() {
        const title = titleInput.value.trim();
        const categoryId = categorySelect.value;
        const file = fileInput.files[0];

        if (title && categoryId && file) {
            submitButton.classList.add('active');
        } else {
            submitButton.classList.remove('active');
        }
    }

    // Ajouter des écouteurs d'événements aux input
    titleInput.addEventListener('input', checkFormValidity);
    categorySelect.addEventListener('change', checkFormValidity);
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && validateFile(file)) {
            checkFormValidity();
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                uploadPlaceholder.classList.add('uploaded');
                imagePreview.style.display = "block";
            }
            reader.readAsDataURL(file);
        } else {
            fileInput.value = ''; // Réinitialiser l'input file si le fichier n'est pas valide
            checkFormValidity();
        }
    });

    // Ajouter un écouteur d'événement au bouton de soumission
    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();
        const title = titleInput.value.trim();
        const categoryId = parseInt(categorySelect.value); // S'assurer que categoryId est un entier
        const file = fileInput.files[0];

        console.log(`Titre : ${title}`);
        console.log(`ID de catégorie : ${categoryId}`);
        console.log(`Fichier : ${file}`);

        if (title && categoryId && file) {
            await sendWork(title, categoryId, file);
        } else {
            alert('Veuillez remplir tous les champs');
        }
    });
}

// Fonction pour valider le fichier image
function validateFile(file) {
    const validTypes = ['image/jpeg', 'image/png'];
    const maxSize = 4 * 1024 * 1024; // 4 Mo en octets

    if (!validTypes.includes(file.type)) {
        alert('Seuls les fichiers JPG et PNG sont autorisés.');
        return false;
    }

    if (file.size > maxSize) {
        alert('La taille du fichier ne doit pas dépasser 4 Mo.');
        return false;
    }

    return true;
}

// Exécution des fonctions d'affichage initiales
editDisplay();
adminModalDisplay();
