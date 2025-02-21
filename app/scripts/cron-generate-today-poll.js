// app\scripts\cron-generate-today-song.js

import admin from "firebase-admin";
import { getSheetsData } from "./google-sheets-data";
import { createTodayPollImg } from "./create-today-poll-image";
import { CreateAnnouncementText } from "./create-announcemnet-text";
import { updateTodayPoll } from "./update-today-poll-only";

export async function runCronGeneratePollImage() {
    try {
        if (!admin.apps.length) {
            let sa = process.env.FIREBASE_SERVER_SERVICE_ACCOUNT_KEY || "{}";
            if (process.env.NEXT_PUBLIC_BASE_URL === "http://localhost:3000") {
                sa = sa.replace(/\n/g, "\\n");
            };
            const serviceAccount = JSON.parse(sa);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: "gs://starglow-voting.firebasestorage.app",
            });
        }

        const sheetsData = await getSheetsData();
        const rows = sheetsData;

        let targetIndex = 0;
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
        let latestEndDate = new Date();
        latestEndDate.setFullYear(now.getFullYear() + 20);
        Object.values(rows).forEach((row) => {
            // end, pollId 가져오기
            const endValue = row.end;
            const pollId = row.poll_id;

            // 날짜 비교
            const endDate = new Date(endValue.trim());

            const pollTitle = row.title;
            const pollOption = row.options.split(";");
            const pollImg = row.poll_announce_img;

            if (now < endDate && endDate < latestEndDate && pollTitle && pollOption.length > 1 && !pollImg) {
                latestEndDate = endDate;
                targetIndex = pollId;
            }
        });

        const row = rows[targetIndex];
        const pollId = row.poll_id;
        const buffer = await createTodayPollImg(pollId);
        if (!buffer) {
            throw new Error("Failed to create poll image");
        }
        const filename = `today-poll/poll_${pollId}.png`;
        const bucket = admin.storage().bucket();
        await bucket.file(filename).save(buffer, {
            contentType: "image/png",
            public: true, // public URL로 접근할 수 있게
            metadata: {
                cacheControl: "public, max-age=31536000",
            },
        });
        const url = `https://storage.googleapis.com/${bucket.name
            }/${encodeURIComponent(filename)}`;

        const message = CreateAnnouncementText(row);

        const result = await updateTodayPoll(pollId, url, message);
        return { success: true, result };

    } catch (err) {
        console.error("runCronGenerateResultImage Error:", err);
        return { success: false, error: err.message };
    }
}