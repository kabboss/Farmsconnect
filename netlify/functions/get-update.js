exports.handler = async (event) => {
    // Gestion des requêtes OPTIONS (CORS)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*', // Changer ici pour * si Cordova bloque
            },
            body: '',
        };
    }

    // Gestion des requêtes GET
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "*", // Forcer l'acceptation des requêtes Cordova
            },
            body: JSON.stringify({
                downloadUrl: "https://drive.google.com/uc?export=download&id=1hB4kppnFgFTfZ22bLt56ou1Pu2RlkTOj",
                message: "📱 Mise à jour disponible ! 🔄\n📅 Publiée le : 11 mars 2025.",
            }),
        };
    }

    // Gestion des requêtes non trouvées
    return {
        statusCode: 404,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "❌ Endpoint non trouvé" }),
    };
};
