const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");  // Adapte le chemin de ton modèle User

// Connecte-toi à MongoDB ici si ce n'est pas déjà fait

exports.handler = async (event, context) => {
  const { username, email, contact, password } = JSON.parse(event.body);

  // Validation des données reçues
  if (!username || !email || !contact || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Tous les champs sont requis." }),
    };
  }

  try {
    const user = await User.findOne({ username });
    if (!user || user.email !== email || user.contact !== contact) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Informations incorrectes.' }),
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Mot de passe incorrect.' }),
      };
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'ka23bo23re23',
      { expiresIn: '1h' }
    );

    // Le cookie n'est pas directement supporté sur Netlify Functions
    // mais si tu veux ajouter un cookie, tu dois retourner le header approprié
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
        'Set-Cookie': `token=${token}; HttpOnly; Max-Age=3600; Path=/; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production' ? 'true' : 'false'}`,
        'Content-Type': 'application/json',
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
