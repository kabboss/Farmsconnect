exports.handler = async (event) => {
    const versionCode = "v2.4.0"; // Le code de version unique

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
                versionCode: versionCode,  // Le code de version unique
                downloadUrl: "https://drive.google.com/file/d/1hB4kppnFgFTfZ22bLt56ou1Pu2RlkTOj/view?usp=sharing",
                message: `📱 Mise à jour disponible: ${versionCode} 🔄\n📅 Publiée le : 10 mars 2025.`,
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
