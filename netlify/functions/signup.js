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
        // Vérification que la méthode est POST
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,  // Méthode non autorisée
                body: JSON.stringify({ message: 'Méthode HTTP non autorisée, utilisez POST.' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',  // CORS autorisé pour tous les domaines
                    'Content-Type': 'application/json',
                }
            };
        }
    
        // Récupérer les données du corps de la requête
        let data;
        try {
            data = JSON.parse(event.body);
        } catch (err) {
            return {
                statusCode: 400,  // Mauvaise requête
                body: JSON.stringify({ message: 'Données JSON invalides.' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            };
        }
    
        const { username, email, contact, password, userType } = data;
    
        // Vérification que tous les champs sont fournis
        if (!username || !email || !contact || !password || !userType) {
            return {
                statusCode: 400,  // Mauvaise requête
                body: JSON.stringify({ message: "Tous les champs sont requis." }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            };
        }
    
        // Vérification que userType est valide
        const validUserTypes = ["vendeur", "visiteur", "veterinaire", "eleveur"];
        if (!validUserTypes.includes(userType)) {
            return {
                statusCode: 400,  // Mauvaise requête
                body: JSON.stringify({ message: "Type d'utilisateur invalide." }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            };
        }
    
        try {
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return {
                    statusCode: 400,  // Mauvaise requête
                    body: JSON.stringify({ message: 'Cet utilisateur existe déjà.' }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                    }
                };
            }
    
            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, contact, password: hashedPassword, userType });
    
            // Sauvegarder l'utilisateur dans la base de données
            await newUser.save();
    
            return {
                statusCode: 201,  // Création réussie
                body: JSON.stringify({ message: 'Utilisateur créé avec succès !' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            };
    
        } catch (error) {
            console.error('Erreur lors de l’inscription :', error);
            return {
                statusCode: 500,  // Erreur serveur
                body: JSON.stringify({ message: 'Erreur serveur : ' + error.message }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                }
            };
        }
    };
    