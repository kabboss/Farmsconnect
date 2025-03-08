    // Variable globale pour stocker la localisation
    let AchtLocation = null;

    // Vérifie si l'environnement est Cordova ou non
    const isCordova = !!window.cordova;
    
    // Charge les fonctionnalités dès que la page ou Cordova est prêt
    document.addEventListener(isCordova ? 'deviceready' : 'DOMContentLoaded', function () {
        initializeLocationCheck();
    });
    
    // Initialisation de la vérification de localisation
    function initializeLocationCheck() {
        if (isCordova) {
            checkGPSAndRequestPermission();
        } else {
            checkBrowserGeolocation();
        }
    }
    
    // Vérifie si le GPS est activé et demande les permissions
    function checkGPSAndRequestPermission() {
        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
            if (enabled) {
                checkCordovaPermission();
            } else {
                cordova.plugins.diagnostic.switchToLocationSettings();
                setTimeout(() => {
                    cordova.plugins.diagnostic.isLocationEnabled(function (enabledAfterSwitch) {
                        if (enabledAfterSwitch) {
                            checkCordovaPermission();
                        } else {
                            showAlert("❌ Veuillez activer le GPS pour continuer.");
                        }
                    }, function (error) {
                        showAlert("❌ Erreur lors de la vérification du GPS : " + error);
                    });
                }, 5000);
            }
        }, function (error) {
            showAlert("❌ Erreur lors de la vérification du GPS : " + error);
        });
    }
    
    // Vérifie les permissions sous Cordova
    function checkCordovaPermission() {
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
    
    // Vérifie la géolocalisation dans un navigateur
    function checkBrowserGeolocation() {
        if (!navigator.geolocation) {
            showAlert("❌ La géolocalisation n'est pas supportée par votre appareil ou navigateur.");
            return;
        }
        requestGeolocation();
    }
    
    // Demande la position géographique
    function requestGeolocation() {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                AchtLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log("Position détectée :", AchtLocation);
            },
            function (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    showAlert("❌ Permission de localisation refusée. Veuillez l'activer dans vos paramètres.");
                } else {
                    showAlert("❌ Impossible de récupérer votre position. Vérifiez si la localisation est activée.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
    
    
    