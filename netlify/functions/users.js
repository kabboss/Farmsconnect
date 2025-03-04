const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Récupérer le chemin du fichier users.html
        const filePath = path.join(__dirname, '..', 'public', 'users.html');

        // Lire le fichier users.html
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Retourner le contenu du fichier avec un statut 200
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            body: fileContent,
        };
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur lors de la lecture du fichier' }),
        };
    }
};
