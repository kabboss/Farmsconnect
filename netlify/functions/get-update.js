exports.handler = async (event) => {
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

    // Gérer la requête principale (par exemple GET ou POST)
    try {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  // Pour gérer CORS
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",  // Permet les requêtes GET, POST, OPTIONS
                "Access-Control-Allow-Headers": "Content-Type, Authorization", // En-têtes autorisés
            },
            body: JSON.stringify({
                downloadUrl: "https://drive.google.com/uc?export=download&id=12zATa4beMkU8AcavDwTYbWJP4JLg2kpH",
                message: `📱 Mise à jour disponible: V2.1.0 (Optimal) 🔄\n
                          📅 Publiée le : 22 janvier 2025.`,
            }),
        };
    } catch (err) {
        console.error("❌ Erreur lors de l'envoi du lien de mise à jour :", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Erreur serveur" }),
        };
    }
};
