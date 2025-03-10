// Variable globale pour stocker la localisation
let AchtLocation = null;

// Vérifie si l'environnement est Cordova
const isCordova = !!window.cordova;

// Charge les fonctionnalités dès que Cordova ou le DOM est prêt
document.addEventListener(isCordova ? 'deviceready' : 'DOMContentLoaded', function () {
    initializeLocationCheck();
});

// Initialisation de la vérification de localisation
function initializeLocationCheck() {
    if (isCordova) {
        console.log("📱 Cordova détecté !");
        checkGPSAndRequestPermission();
    } else {
        console.log("🌐 Navigateur détecté !");
        checkBrowserGeolocation();
    }
}

// Vérifie si le GPS est activé et demande les permissions sous Cordova
function checkGPSAndRequestPermission() {
    if (!cordova.plugins || !cordova.plugins.diagnostic) {
        console.error("❌ Plugin Diagnostic introuvable !");
        showAlert("❌ Erreur : Plugin Diagnostic non chargé.");
        return;
    }

    cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
        if (enabled) {
            console.log("✅ GPS activé !");
            checkCordovaPermission();
        } else {
            console.warn("⚠️ GPS désactivé. Demande d'activation...");
            cordova.plugins.diagnostic.switchToLocationSettings();
            setTimeout(() => {
                cordova.plugins.diagnostic.isLocationEnabled(function (enabledAfterSwitch) {
                    if (enabledAfterSwitch) {
                        console.log("✅ GPS activé après redirection !");
                        checkCordovaPermission();
                    } else {
                        showAlert("❌ Veuillez activer le GPS pour continuer.");
                    }
                }, function (error) {
                    console.error("❌ Erreur GPS : " + error);
                    showAlert("❌ Erreur lors de la vérification du GPS.");
                });
            }, 5000);
        }
    }, function (error) {
        console.error("❌ Erreur lors de la vérification du GPS : " + error);
        showAlert("❌ Erreur lors de la vérification du GPS.");
    });
}

// Vérifie et demande les permissions sous Cordova (Android WebView)
function checkCordovaPermission() {
    if (!cordova.plugins || !cordova.plugins.diagnostic) {
        console.error("❌ Plugin Diagnostic introuvable !");
        showAlert("❌ Erreur : Plugin Diagnostic non chargé.");
        return;
    }

    cordova.plugins.diagnostic.getLocationAuthorizationStatus(function(status) {
        if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED ||
            status === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
            console.log("✅ Permission de localisation accordée !");
            requestGeolocation();
        } else {
            console.warn("⚠️ Permission de localisation non accordée. Demande en cours...");
            cordova.plugins.diagnostic.requestLocationAuthorization(function(status) {
                if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED ||
                    status === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
                    console.log("✅ Permission maintenant accordée !");
                    requestGeolocation();
                } else {
                    console.error("❌ L'utilisateur a refusé la permission de localisation.");
                    showAlert("❌ Permission de localisation refusée.");
                }
            }, function(error) {
                console.error("❌ Erreur lors de la demande de permission : " + error);
                showAlert("❌ Erreur lors de la demande de permission.");
            });
        }
    }, function(error) {
        console.error("❌ Erreur lors de la vérification de la permission : " + error);
        showAlert("❌ Erreur lors de la vérification des permissions.");
    });
}

// Vérifie et demande l'autorisation de localisation pour les navigateurs
function checkBrowserGeolocation() {
    if (!navigator.geolocation) {
        showAlert("❌ La géolocalisation n'est pas supportée par votre appareil ou navigateur.");
        return;
    }

    if (navigator.permissions) {
        navigator.permissions.query({ name: "geolocation" }).then(function (result) {
            if (result.state === "granted") {
                console.log("✅ Permission accordée !");
                requestGeolocation();
            } else if (result.state === "prompt") {
                console.log("⚠️ Permission demandée...");
                requestGeolocation();
            } else {
                console.error("❌ Permission refusée.");
                showAlert("❌ Permission refusée.");
            }
        }).catch(function (error) {
            console.error("❌ Erreur de permission : " + error);
            showAlert("❌ Erreur de permission.");
        });
    } else {
        requestGeolocation();
    }
}

// Demande la position géographique (commun à WebView et navigateur)
function requestGeolocation() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            AchtLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            console.log("📍 Position détectée :", AchtLocation);
        },
        function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.error("❌ Permission refusée.");
                    showAlert("❌ Permission refusée.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error("❌ Position indisponible.");
                    showAlert("❌ Position indisponible.");
                    break;
                case error.TIMEOUT:
                    console.error("❌ Temps d'attente dépassé.");
                    showAlert("❌ Temps d'attente dépassé.");
                    break;
                default:
                    console.error("❌ Erreur inconnue : " + error.message);
                    showAlert("❌ Erreur inconnue.");
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Fonction pour afficher une alerte utilisateur
function showAlert(message) {
    if (isCordova && navigator.notification) {
        navigator.notification.alert(message);
    } else {
        alert(message);
    }
}

// Fonction pour afficher ou masquer les produits en fonction de la catégorie sélectionnée
function showCategory(category) {
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        if (category === "" || product.classList.contains(category)) {
            product.classList.add('show');
        } else {
            product.classList.remove('show');
        }
    });
}

// Fonction pour afficher ou masquer le menu déroulant
function toggleDropdown() {
    const dropdown = document.getElementById("categoryDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}
