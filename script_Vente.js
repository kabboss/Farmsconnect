// Variable globale pour stocker la localisation
let vendLocation = null;

// Vérifie si l'environnement est Cordova (application mobile) ou un navigateur classique
const isCordova = !!window.cordova;

// Charge les fonctionnalités dès que Cordova ou le DOM est prêt
document.addEventListener(isCordova ? 'deviceready' : 'DOMContentLoaded', initializeLocationCheck);

// Initialisation de la vérification de localisation
function initializeLocationCheck() {
    if (isCordova) {
        checkGPSAndRequestPermission(); // Vérification GPS et permissions sous Cordova
    } else {
        checkBrowserGeolocation(); // Vérification géolocalisation sur navigateur
    }
}

// Vérifie si le GPS est activé et demande les permissions sous Cordova
function checkGPSAndRequestPermission() {
    if (!cordova.plugins || !cordova.plugins.diagnostic) {
        showAlert("❌ Plugin de diagnostic indisponible. Impossible de vérifier le GPS.");
        return;
    }

    cordova.plugins.diagnostic.isLocationEnabled(
        function (enabled) {
            if (enabled) {
                checkCordovaPermission();
            } else {
                // Demande à l'utilisateur d'activer le GPS
                cordova.plugins.diagnostic.switchToLocationSettings();
                setTimeout(() => {
                    cordova.plugins.diagnostic.isLocationEnabled(
                        function (enabledAfterSwitch) {
                            if (enabledAfterSwitch) {
                                checkCordovaPermission();
                            } else {
                                showAlert("❌ Veuillez activer le GPS pour continuer.");
                            }
                        },
                        function (error) {
                            showAlert("❌ Erreur lors de la vérification du GPS : " + error);
                        }
                    );
                }, 5000);
            }
        },
        function (error) {
            showAlert("❌ Erreur lors de la vérification du GPS : " + error);
        }
    );
}

// Vérifie et demande les permissions de localisation sous Cordova
function checkCordovaPermission() {
    if (!cordova.plugins || !cordova.plugins.permissions) {
        showAlert("❌ Plugin de permissions indisponible. Impossible de vérifier les permissions.");
        return;
    }

    const permissions = cordova.plugins.permissions;

    permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
        if (status.hasPermission) {
            requestGeolocation();
        } else {
            permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, function (status) {
                if (status.hasPermission) {
                    requestGeolocation();
                } else {
                    showAlert("❌ Permission de localisation refusée. Veuillez l'activer dans vos paramètres.");
                }
            }, function () {
                showAlert("❌ La permission de localisation est obligatoire pour continuer.");
            });
        }
    }, function () {
        showAlert("❌ Impossible de vérifier les permissions. Vérifiez vos paramètres.");
    });
}

// Vérifie et demande la géolocalisation pour un navigateur
function checkBrowserGeolocation() {
    if (!navigator.geolocation) {
        showAlert("❌ La géolocalisation n'est pas supportée par votre navigateur.");
        return;
    }

    // Vérifie si la permission est déjà accordée (sur les navigateurs modernes)
    if (navigator.permissions) {
        navigator.permissions.query({ name: "geolocation" })
            .then(function (result) {
                if (result.state === "granted" || result.state === "prompt") {
                    requestGeolocation();
                } else {
                    showAlert("❌ Permission de localisation refusée. Activez-la dans vos paramètres.");
                }
            })
            .catch(function (error) {
                showAlert("❌ Erreur lors de la vérification des permissions : " + error);
            });
    } else {
        requestGeolocation();
    }
}

// Demande la position géographique (utilisé pour Cordova et navigateur)
function requestGeolocation() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            vendLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            console.log("📍 Position détectée :", vendLocation);
        },
        function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    showAlert("❌ Permission de localisation refusée. Veuillez l'activer dans les paramètres.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    showAlert("❌ Position indisponible. Vérifiez si votre GPS fonctionne.");
                    break;
                case error.TIMEOUT:
                    showAlert("❌ Délai d'attente dépassé. Essayez à nouveau.");
                    break;
                default:
                    showAlert("❌ Erreur inconnue : " + error.message);
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Fonction pour afficher une alerte (à adapter selon ton interface)
function showAlert(message) {
    alert(message); // Utilise une alerte basique, peut être remplacée par un modal personnalisé
}


// Gestion du formulaire de vente
document.getElementById('vente-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Vérifie que la localisation est activée
    if (!vendLocation) {
        showAlert("❌ La localisation doit être activée pour soumettre le formulaire.");
        return;
    }




    // Calcul des prix et commission
    const prixUnitaire = parseFloat(document.getElementById('prix').value);
    const commission = prixUnitaire * 0.04;
    const prixFinal = prixUnitaire + commission;

// Création de l'objet animal
const animal = {
    usernameVendeur: document.getElementById('username-vendeur').value, // Ajout du nom d'utilisateur du vendeur
    categorie: document.getElementById('categorie').value,
    nombre: document.getElementById('nombre').value,
    poids: document.getElementById('poids').value,
    prix: prixUnitaire,
    prixFinal: prixFinal.toFixed(2),
    images: [], // Vous pouvez remplir ce tableau si nécessaire pour inclure les fichiers sélectionnés
    contactPrincipal: document.getElementById('contact-principal').value,
    contactSecondaire: document.getElementById('contact-secondaire').value,
    emailVendeur: document.getElementById('email-vendeur').value,
    codeVendeur: 'Annonce N°' + Date.now(), // Génère un code unique basé sur le timestamp
    location: vendLocation // La localisation ajoutée ici
};

    console.log("Infos animal :", animal);

// Traitement des images et envoi des données
sendData(animal);


});



// Fonction pour envoyer les données de l'annonce
function sendData(animal) {
    const files = document.getElementById('images').files;
    if (files.length === 0) {
        showAlert("❌ Veuillez sélectionner au moins une image.");
        return;
    }

    const processImages = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                const img = new Image();
                img.onload = () => {
                    const maxWidth = 600;
                    const maxHeight = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            height = Math.floor((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.floor((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedImage = canvas.toDataURL('image/jpeg', 0.6);
                    resolve(compressedImage);
                };
                img.onerror = reject;
                img.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(processImages).then(images => {
        animal.images = images;

    // Assure-toi que `location` est bien inclus
    console.log("Objet envoyé au serveur :", JSON.stringify(animal));

        fetch('https://farmsconnect.netlify.app/.netlify/functions/annonces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animal)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Erreur HTTP : ${response.status} - ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Annonce envoyée avec succès", data);
            showAlert(successMessage, linkMessage);
        
            // Recharge la page après l'envoi
            setTimeout(() => {
                location.reload(); // Recharge la page après un délai de 1 seconde
            }, 7000);
        })

        
        
        .catch(error => {
            showAlert("Erreur lors de l'envoi : " + error.message);
        });
    });
}

// Fonction pour afficher un message d'alerte
function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("alertMessage");

    alertMessage.textContent = message;
    alertBox.classList.add("visible");

    setTimeout(() => closeAlert(), 10000);
}

// Fonction pour fermer l'alerte
function closeAlert() {
    const alertBox = document.getElementById("customAlert");
    alertBox.classList.remove("visible");
}
