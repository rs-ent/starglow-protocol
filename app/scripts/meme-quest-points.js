// app\scripts\meme-quest-points.js

export const fetchPoints = async ({ telegramId }) => {
    try {
        const response = await fetch(
            `/api/meme-quest/point?telegramId=${encodeURIComponent(telegramId)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch points.");
        }

        console.log("meme-quest-point-check response:", data);
        return data.points || 0;
    } catch (error) {
        console.error("Error fetching points:", error);
        return 0;
    }
};

export const changePoints = async ({ telegramId, additionalPoints }) => {
    try {
        const response = await fetch("/api/meme-quest/point", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ telegramId, points: additionalPoints }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to change points.");
        }

        console.log("meme-quest-point-change response:", data);
        return data;
    } catch (error) {
        console.error("Error changing points:", error);
        return { error: error.message };
    }
};