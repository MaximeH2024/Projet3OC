import { genPagesModal } from './works.js';
import { cleanStorage, closeModal } from './works.js';
import { worksCat } from './works.js';
import { sendWork } from './works.js';
import { openModal } from './modalState.js';

async function adminCheck() {
    await cleanStorage();
    editDisplay();
}

adminCheck();

let works;

async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
}
await fetchWorks();

adminModalDisplay();

function editDisplay() {
    const tokenValidation = window.localStorage.getItem("Token");

    const modEdition = document.getElementById("edit-mod");
    const modModif = document.getElementById("btn-modif");

    if (modEdition && tokenValidation && modModif) {
        modEdition.style.display = 'flex';
        modModif.style.display = 'flex';
    }
}

async function adminModalDisplay() {
    const showModal = document.querySelector("#btn-modif");
    const modalDisplay = document.getElementById("modal-admin");

    if (showModal && modalDisplay) {
        showModal.addEventListener("click", function(event) {
            event.preventDefault();
            console.log("je clique pour génerer ma page");
            openModal();
        });

        window.addEventListener('click', function(event) {
            if (event.target === modalDisplay) {
                closeModal();
            }
        });
    }
}

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

    // Creating the form container
    const formContainer = document.createElement("div");
    formContainer.className = "form-container";

    // Creating the image upload section
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
    fileInput.style.display = "none"; // Hide the actual file input

    // Create image preview element
    const imagePreview = document.createElement("img");
    imagePreview.className = "image-preview";
    imagePreview.style.display = "none"; // Initially hidden
    imagePreview.style.maxWidth = "100%";
    imagePreview.style.maxHeight = "100%";

    // Appending elements to imageUpload section
    uploadPlaceholder.appendChild(placeholderIcon);
    uploadPlaceholder.appendChild(addPhotoText);
    uploadPlaceholder.appendChild(fileSizeText);

    fileInputLabel.appendChild(uploadPlaceholder);
    imageUpload.appendChild(fileInputLabel);
    imageUpload.appendChild(fileInput);
    imageUpload.appendChild(imagePreview); // Add preview image to the upload section

    // Creating the title field
    const titleField = document.createElement("div");
    titleField.className = "form-field";

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.innerText = "Titre";

    const titleInput = document.createElement("input");
    titleInput.id = "title";
    titleInput.type = "text";

    // Appending elements to title field
    titleField.appendChild(titleLabel);
    titleField.appendChild(titleInput);

    // Creating the category field
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

    // Populate the category select with options from worksCat
    worksCat.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.innerText = category.name;
        categorySelect.appendChild(option);
    });

    // Appending elements to category field
    categoryField.appendChild(categoryLabel);
    categoryField.appendChild(categorySelect);

    // Appending all sections to form container
    formContainer.appendChild(imageUpload);
    formContainer.appendChild(titleField);
    formContainer.appendChild(categoryField);

    // Creating the submit button
    const submitButton = document.createElement("div");
    submitButton.className = "submit-button";
    submitButton.innerText = "Valider";

    // Appending elements to wrapper
    wrapperSelection.appendChild(headerModal);
    wrapperSelection.appendChild(titleModal);
    wrapperSelection.appendChild(formContainer);
    wrapperSelection.appendChild(submitButton);

    closeModal.addEventListener('click', function() {
        modalDisplay.style.display = 'none';
    });

    goBackModal.addEventListener('click', function() {
        wrapperSelection.innerHTML = "";
        genPagesModal(works);
    });

    // Add event listener to file input to handle image preview
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block"; // Show the image preview
            }
            reader.readAsDataURL(file);
        }
    });

    // Add event listener to submit button
    submitButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Empêcher le comportement par défaut du bouton
    
        const title = titleInput.value;
        const categoryId = categorySelect.value;
        const file = fileInput.files[0];
    
        if (title && categoryId && file) {
            await sendWork(title, categoryId, file);
        } else {
            alert('Please fill all fields');
        }
    });
}

