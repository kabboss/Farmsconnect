exports.handler = async (event) => {
    // 1️⃣ Gérer les requêtes préflight (OPTIONS)
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

    // 2️⃣ Gérer les requêtes GET
    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                downloadUrl: "https://drive.google.com/file/d/1hB4kppnFgFTfZ22bLt56ou1Pu2RlkTOj/view?usp=sharing",
                message: "📱 Mise à jour! 🔄\n📅 Publiée le : 10 mars 2025.",
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
