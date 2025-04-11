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
                downloadUrl: "https://drive.google.com/file/d/199FlZziHhrBWQoc__9le2aplArVfaILU/view?usp=sharing",
                message: `📲 Nouvelle mise à jour disponible 🗓️ Publiée le : 11 avril 2025 ⚠️ Si vous avez installé l'application avant cette date, veuillez la mettre à jour pour bénéficier des dernières améliorations.🔗 Cliquez sur le lien ci-dessous pour télécharger la nouvelle version.`,
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
