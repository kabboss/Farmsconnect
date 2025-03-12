const mongoose = require('mongoose');
const CollecteDonnees = require('../../models/collecteDonnees'); // Assure-toi d'importer correctement le modèle

// Se connecter à MongoDB
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB...'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));


// Fonction handler pour la requête
exports.handler = async function(event, context) {
  // Ajouter les en-têtes CORS
  const headers = {
    "Access-Control-Allow-Origin": "*", // Autoriser toutes les origines, vous pouvez spécifier un domaine particulier
    "Access-Control-Allow-Methods": "OPTIONS, POST", // Méthodes autorisées
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // En-têtes autorisés
  };

  if (event.httpMethod === "OPTIONS") {
    // Gérer les requêtes préliminaires (prévol)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Options request accepted" }),
    };
  }

  if (event.httpMethod === "POST") {
    try {
      // Parser les données envoyées dans la requête
      const requestData = JSON.parse(event.body);

      // Se connecter à MongoDB si ce n'est pas déjà fait
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      }

      // Créer une nouvelle entrée dans la collection
      const collecte = new CollecteDonnees({
        Nom_prenom: requestData.Nom_prenom,
        Numero_telephone: requestData.Numero_telephone,
        Numero_telephone2: requestData.Numero_telephone2,
        age: requestData.age,
        region: requestData.region,
        Localite: requestData.Localite,
        sexe: requestData.sexe,
        education: requestData.education,
        type_elevage: requestData.type_elevage,
        nombre_animaux: requestData.nombre_animaux,
        revenus_elevage: requestData.revenus_elevage,
        mode_alimentation: requestData.mode_alimentation,
        acces_eau: requestData.acces_eau,
        defis: requestData.defis,
        autres_defis: requestData.autres_defis,
        dechets_animaux: requestData.dechets_animaux,
        utilisation_technologie: requestData.utilisation_technologie,
        technologies_utilisees: requestData.technologies_utilisees,
        acces_formation: requestData.acces_formation,
        type_formation: requestData.type_formation,
        financement: requestData.financement,
        besoin_financier: requestData.besoin_financier,
        plan_futur: requestData.plan_futur
      });

      // Sauvegarder les données dans la base de données
      await collecte.save();

      // Retourner une réponse avec succès
      return {
        statusCode: 200,
        headers, // Ajouter les en-têtes CORS à la réponse
        body: JSON.stringify({
          message: "Données enregistrées avec succès!",
          data: collecte,
        })
      };

    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données : ", error);

      return {
        statusCode: 500,
        headers, // Ajouter les en-têtes CORS à la réponse
        body: JSON.stringify({ message: "Une erreur est survenue lors du traitement des données." })
      };
    }
  } else {
    return {
      statusCode: 405,
      headers, // Ajouter les en-têtes CORS à la réponse
      body: JSON.stringify({ message: "Méthode HTTP non autorisée" })
    };
  }
};
