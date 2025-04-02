exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204, // No Content
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: "",
        };
    }

    try {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Autorise toutes les origines
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({
                downloadUrl: "https://drive.google.com/file/d/1j6B_w-IBnKxK10mzl1KtzDhMBdYolbik/view?usp=sharing",
                message: `📱 Mise à jour 🔄\n Publiée le : 02 Avril 2025📅 .`,
            }),
        };
    } catch (err) {
        console.error("❌ Erreur lors de l'envoi du lien de mise à jour :", err);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ message: "Erreur serveur" }),
        };
    }
};
