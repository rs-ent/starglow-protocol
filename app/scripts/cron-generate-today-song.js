// app\scripts\cron-generate-today-song.js

import admin from "firebase-admin";
import { getSheetsData } from "./google-sheets-data";
import { createTodaySongImg } from "./create-today-song-image";
import { updateTodaySongs } from "./update-today-songs-only";

export async function runCronGenerateSongImages() {
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

        let targetIndex = 'p1';
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
        let latestEndDate = new Date();
        latestEndDate.setFullYear(now.getFullYear() + 20);
        // (D) 실제 데이터 행 반복
        Object.values(rows).forEach((row) => {
            // end, pollId 가져오기
            const endValue = row.end;
            const pollId = row.poll_id;

            // 날짜 비교
            const endDate = new Date(endValue.trim());
            const songLength = row.song_title.split(";").filter(item => item !== "").length;
            const imgLength = row.song_announce_img.split(";").filter(item => item !== "").length;


            if (now < endDate && endDate < latestEndDate && songLength > 0 && songLength > imgLength) {
                latestEndDate = endDate;
                targetIndex = pollId;
            }
        });

        const row = rows[targetIndex];
        const pollId = row.poll_id;
        const existingImg = row.song_announce_img.split(";").filter(item => item !== "");
        let urls = [];
        urls = urls.concat(existingImg);

        const buffer = await createTodaySongImg(pollId, existingImg.length);
        const filename = `today-song/song_${pollId}_${existingImg.length}_${Date.now()}.png`;
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
        urls.push(url);

        const songsUrl = urls.join(";");
        const result = await updateTodaySongs(pollId, songsUrl);
        return { success: true, result };
    } catch (err) {
        console.error("runCronGenerateResultImage Error:", err);
        return { success: false, error: err.message };
    }
}