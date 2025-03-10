exports.handler = async (event) => {
    // 1️⃣ Gérer les requêtes préflight (OPTIONS)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content
            headers: {
                'Access-Control-Allow-Origin': '*',  // Permet toutes les origines
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Méthodes autorisées
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    // 2️⃣ Gérer les requêtes GET
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  // Active CORS
            },
            body: JSON.stringify({
                downloadUrl: "https://drive.google.com/uc?export=download&id=12zATa4beMkU8AcavDwTYbWJP4JLg2kpH",
                message: `📱 Mise à jour disponible: V2.1.0 (Optimal) 🔄\n📅 Publiée le : 22 janvier 2025.`,
            }),
        };
    }

    // 3️⃣ Gérer une URL invalide
    return {
        statusCode: 404,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "❌ Endpoint non trouvé" }),
    };
};
