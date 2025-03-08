const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    try {
        // Déterminer le chemin du fichier Visiteur.html
        const filePath = path.resolve(__dirname, '..', 'public', 'Visiteur.html');

        // Vérifier si le fichier existe avant de le lire
        if (!fs.existsSync(filePath)) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Fichier non trouvé' }),
                headers: {
                    'Access-Control-Allow-Origin': '*', // Permet à tous les domaines d'accéder à l'API
                    'Content-Type': 'application/json',
                },
            };
        }

        // Lire le contenu du fichier Visiteur.html de manière asynchrone
        const fileContent = await fs.promises.readFile(filePath, 'utf8');

        // Retourner le contenu du fichier avec un statut 200
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Permet à tous les domaines d'accéder à l'API
                'Content-Type': 'text/html',
            },
            body: fileContent,
        };
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur lors de la lecture du fichier' }),
            headers: {
                'Access-Control-Allow-Origin': '*', // Permet à tous les domaines d'accéder à l'API
                'Content-Type': 'application/json',
            },
        };
    }
};
