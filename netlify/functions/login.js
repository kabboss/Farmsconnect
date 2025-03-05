
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
  // Vérification de la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,  // Method Not Allowed
      body: JSON.stringify({ message: 'Méthode non autorisée. Utilisez POST.' }),
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
    };
  }

  const { username, email, contact, password } = data;

  // Validation des données reçues
  if (!username || !email || !contact || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Tous les champs sont requis." }),
    };
  }

  try {
    // Recherche de l'utilisateur par son nom d'utilisateur
    const user = await User.findOne({ username });
    if (!user || user.email !== email || user.contact !== contact) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Informations incorrectes.' }),
      };
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Mot de passe incorrect.' }),
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
        'Content-Type': 'application/json',
        // Décommente si tu veux utiliser un cookie
        // 'Set-Cookie': `token=${token}; HttpOnly; Max-Age=3600; Path=/; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production' ? 'true' : 'false'}`,
      },
    };

  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erreur serveur : ' + error.message }),
    };
  }
};
