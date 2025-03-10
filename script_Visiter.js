
// Fonction pour afficher une alerte personnalisée
function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;
    alertBox.classList.remove("hidden");
    alertBox.classList.add("visible");
}

function closeAlert() {
    const alertBox = document.getElementById("customAlert");
    alertBox.classList.remove("visible");
    alertBox.classList.add("hidden");
}





// Sélectionne les éléments
const modalVisitor = document.getElementById('modal-visitor');
const openModalButtonVisitor = document.querySelector('.open-modal-button');
const closeButtonVisitor = document.querySelector('.close-button');

// Ouvre la fenêtre modale pour les visiteurs
openModalButtonVisitor.addEventListener('click', function() {
    modalVisitor.classList.add('visible'); // Ajoute la classe 'visible' pour afficher la modale
});

// Ferme la fenêtre modale pour les visiteurs
closeButtonVisitor.addEventListener('click', function() {
    modalVisitor.classList.remove('visible'); // Retire la classe 'visible' pour masquer la modale
});

// Ferme la fenêtre modale si l'utilisateur clique en dehors de celle-ci
window.addEventListener('click', function(event) {
    if (event.target === modalVisitor) {
        modalVisitor.classList.remove('visible'); // Masque la modale si on clique en dehors
    }
});




document.addEventListener("DOMContentLoaded", () => {
    // Sélection de toutes les images des cartes
    document.querySelectorAll(".animal-card img").forEach(img => {
        img.addEventListener("click", () => {
            openFullScreen(img.src);
        });
    });
});

// Fonction pour afficher une image en plein écran
function openFullScreen(src) {
    const fullscreenContainer = document.createElement("div");
    fullscreenContainer.classList.add("fullscreen-img");

    fullscreenContainer.innerHTML = `
        <span class="close-fullscreen">&times;</span>
        <img src="${src}" alt="Image en plein écran">
    `;

    document.body.appendChild(fullscreenContainer);

    // Fermer l'image en plein écran au clic
    fullscreenContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("close-fullscreen") || e.target === fullscreenContainer) {
            fullscreenContainer.remove();
        }
    });
}
