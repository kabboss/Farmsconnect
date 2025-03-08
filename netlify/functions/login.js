const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');  // Adapte le chemin de ton modèle User

// Se connecter à MongoDB
const mongoURI = 'mongodb+srv://kabboss:ka23bo23re23@cluster0.uy2xz.mongodb.net/FarmsConnect?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB...'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

exports.handler = async (event, context) => {
  // Gérer les requêtes préflight CORS (OPTIONS)
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

  // Vérification de la méthode HTTP (accepter uniquement POST)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,  // Method Not Allowed
      body: JSON.stringify({ message: 'Méthode non autorisée. Utilisez POST.' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    };
  }

  let data = {};

  // Sécuriser le parsing JSON
  try {
    if (event.body) {
      data = JSON.parse(event.body);
    } else {
      throw new Error('Le corps de la requête est vide');
    }
  } catch (parseError) {
    return {
      statusCode: 400,  // Bad Request
      body: JSON.stringify({ message: 'Données JSON invalides. Assurez-vous d\'envoyer un JSON valide.' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    };
  }

  const { username, email, contact, password } = data;

  // Validation des données reçues
  if (!username || !email || !contact || !password) {
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

  try {
    // Recherche de l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ username });
    if (!user || user.email !== email || user.contact !== contact) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Informations incorrectes.' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      };
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Mot de passe incorrect.' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      };
    }

    // Création du token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'ka23bo23re23',
      { expiresIn: '1h' }
    );

    // Réponse avec le token et les infos utilisateur
    return {
      statusCode: 200,
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        contact: user.contact,
        token,
        message: 'Connexion réussie !',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
      }
    };

  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erreur serveur : ' + error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    };
  }
};
