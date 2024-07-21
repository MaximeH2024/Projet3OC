import { genPagesModal } from './works.js';

let works = [];

async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
}
await fetchWorks();

export function openModal() {
    const modalDisplay = document.getElementById("modal-admin");
    const modalWrapper = document.querySelector(".modal-wrapper");

    // Clear the previous content of the modal
    modalWrapper.innerHTML = "";

    // Call genPagesModal to set up the initial view of the modal
    genPagesModal(works);

    // Display the modal
    modalDisplay.style.display = 'flex';
}