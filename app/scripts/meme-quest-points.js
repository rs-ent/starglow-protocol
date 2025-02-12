export const fetchPoints = async ({telegramId}) => {
    try {
        const response = await fetch(
            `/api/meme-quest-point-check?telegramId=${encodeURIComponent(
                telegramId
            )}`
        );
        if (!response.ok) {
            const error = new Error("Failed to fetch points.");
            error.response = response;
            throw error;
        }
        const data = await response.json();
        console.log("meme-quest-point-check response:", data);
        return data.points || 0;
    } catch (error) {
        console.error("Error fetching points:", error);
        return 0;
    }
};

export const changePoints = async ({telegramId, additionalPoints}) => {
    try {
        const response = await fetch("/api/meme-quest-point-change", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({telegramId, points: additionalPoints}),
        });
        if (!response.ok) {
            const error = new Error("Failed to change points.");
            error.response = response;
            throw error;
        }
        const data = await response.json();
        console.log("meme-quest-point-change response:", data);
        return data;
    } catch (error) {
        console.error("Error changing points:", error);
        return {error: error.message};
    }
};