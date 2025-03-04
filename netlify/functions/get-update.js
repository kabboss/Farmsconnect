exports.handler = async () => {
    try {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
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
