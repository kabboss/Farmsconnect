const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/User'); // Assure-toi que le chemin est correct

// Vérifier si la connexion MongoDB est déjà établie pour éviter plusieurs connexions
if (!mongoose.connection.readyState) {
    const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connecté à MongoDB...'))
        .catch(err => console.error('Erreur de connexion à MongoDB:', err));
}

exports.handler = async (event, context) => {
    // ✅ **Gérer les requêtes préflight CORS (OPTIONS)**
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    // ✅ **Vérifier que la méthode HTTP est bien POST**
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,  // Method Not Allowed
            body: JSON.stringify({ message: 'Méthode HTTP non autorisée, utilisez POST.' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
    }

    let data;
    try {
        data = JSON.parse(event.body);
    } catch (err) {
        return {
            statusCode: 400,  // Bad Request
            body: JSON.stringify({ message: 'Données JSON invalides.' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
    }

    const { username, email, contact, password, userType } = data;

    // ✅ **Vérification des champs**
    if (!username || !email || !contact || !password || !userType) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Tous les champs sont requis." }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
    }

    // ✅ **Vérification que userType est valide**
    const validUserTypes = ["vendeur", "visiteur", "veterinaire", "eleveur"];
    if (!validUserTypes.includes(userType)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Type d'utilisateur invalide." }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
    }

    try {
        // ✅ **Vérifier si l'utilisateur existe déjà**
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Cet utilisateur existe déjà.' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }
            };
        }

        // ✅ **Hacher le mot de passe**
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, contact, password: hashedPassword, userType });

        // ✅ **Sauvegarder l'utilisateur dans la base de données**
        await newUser.save();

        return {
            statusCode: 201,  // Created
            body: JSON.stringify({ message: 'Utilisateur créé avec succès !' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Content-Type': 'application/json',
            }
        };

    } catch (error) {
        console.error('Erreur lors de l’inscription :', error);
        return {
            statusCode: 500,  // Internal Server Error
            body: JSON.stringify({ message: 'Erreur serveur : ' + error.message }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
    }
};
