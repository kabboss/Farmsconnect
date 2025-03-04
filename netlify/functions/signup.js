const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// Modèles
const User = require('../../models/User'); // Si tu utilises Mongoose pour l'ORM

// Se connecter à MongoDB
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB...'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

exports.handler = async (event, context) => {
    // Vérifie que la méthode est POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Méthode HTTP non autorisée, utilisez POST.',
        };
    }

    // Récupérer les données du corps de la requête
    const { username, email, contact, password, userType } = JSON.parse(event.body);

    // Vérification que tous les champs sont fournis
    if (!username || !email || !contact || !password || !userType) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Tous les champs sont requis." }),
        };
    }

    // Vérification que userType est valide
    const validUserTypes = ["vendeur", "visiteur", "veterinaire", "eleveur"];
    if (!validUserTypes.includes(userType)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Type d'utilisateur invalide." }),
        };
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Cet utilisateur existe déjà.' }),
            };
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, contact, password: hashedPassword, userType });

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Utilisateur créé avec succès !' }),
        };

    } catch (error) {
        console.error('Erreur lors de l’inscription :', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erreur serveur : ' + error.message }),
        };
    }
};
