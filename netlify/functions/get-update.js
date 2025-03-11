exports.handler = async (event) => {
    // Gestion des requêtes OPTIONS (CORS)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            body: JSON.stringify({
                downloadUrl: "https://drive.google.com/uc?export=download&id=1hB4kppnFgFTfZ22bLt56ou1Pu2RlkTOj",
                message: "📱 Mise à jour 🔄\n📅 Publiée le : 11 mars 2025.",
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
