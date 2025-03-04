const mongoose = require('mongoose');
const Annonce = require('../../models/Annonce'); // Assure-toi que le modèle est bien défini
require('dotenv').config();

// Connexion à MongoDB (avec l'URI en dur)
const dbConnect = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect('mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("✅ Connecté à MongoDB");
        }
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB:", error);
        throw new Error("Impossible de se connecter à la base de données");
    }
};

exports.handler = async (event) => {
    try {
        await dbConnect(); // Connexion à la base de données

        // Récupération des paramètres de pagination
        const page = parseInt(event.queryStringParameters?.page) || 1;
        const limit = parseInt(event.queryStringParameters?.limit) || 10;
        const skip = (page - 1) * limit;

        // Pipeline d'agrégation pour regrouper les annonces par catégorie et prix
        const annonces = await Annonce.aggregate([
            {
                $addFields: {
                    priceBucket: {
                        $switch: {
                            branches: [
                                { case: { $lte: ["$prix", 500] }, then: "0-500" },
                                { case: { $lte: ["$prix", 1000] }, then: "501-1000" },
                                { case: { $lte: ["$prix", 2000] }, then: "1001-2000" },
                                { case: { $lte: ["$prix", 5000] }, then: "2001-5000" },
                                { case: { $gt: ["$prix", 5000] }, then: "5000+" }
                            ],
                            default: "Autres"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { categorie: "$categorie", priceBucket: "$priceBucket" },
                    totalAnnonces: { $sum: 1 },
                    annonces: { $push: "$$ROOT" }
                }
            },
            { $sort: { "_id.categorie": 1, "_id.priceBucket": 1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalCount = await Annonce.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                totalPages,
                currentPage: page,
                totalCount,
                annonces
            }),
            headers: { "Content-Type": "application/json" }
        };
    } catch (error) {
        console.error("❌ Erreur API:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: "Erreur lors de la récupération des annonces",
                error: error.message
            }),
            headers: { "Content-Type": "application/json" }
        };
    }
};
