import { genPagesModal } from './works.js';

let works = [];

async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
}

export async function openModal() {
    const modalDisplay = document.getElementById("modal-admin");
    const modalWrapper = document.querySelector(".modal-wrapper");

    modalWrapper.innerHTML = "";
    await fetchWorks();
    genPagesModal(works);

    modalDisplay.style.display = 'flex';
}