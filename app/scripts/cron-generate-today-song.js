// app\scripts\cron-generate-today-song.js

import { getSheetsClient } from "../google-sheets/getSheetsClient";
import { createTodaySongImg } from "./create-today-song-image";
import { updateTodaySongs } from "./update-today-songs-only";

export async function runCronGenerateSongImages() {
    try {
        const sheets = getSheetsClient();
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
            range: "Poll List!A:Z", // 시트 범위에 맞춰 수정
        });
        const rows = readRes.data.values;
        if (!rows || rows.length < 2) {
            console.log("No data or just header in sheet");
            return { success: true, processed: 0 };
        }

        // (C) 헤더에서 end / poll_id 열 인덱스 찾기
        const header = rows[0];
        const endIndex = header.indexOf("end");
        const pollIdIndex = header.indexOf("poll_id");
        const songTitleIndex = header.indexOf("song_title");
        const songImgIndex = header.indexOf("song_announce_img");
        if (endIndex === -1 || pollIdIndex === -1) {
            console.log("No 'end' or 'poll_id' column found in header");
            return { success: true, processed: 0 };
        }

        let processed = 0;

        let targetIndex = 0;
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
        let latestEndDate = now;
        // (D) 실제 데이터 행 반복
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            // end, pollId 가져오기
            const endValue = row[endIndex];
            const pollId = row[pollIdIndex];
            if (!endValue || !pollId) continue;

            // 날짜 비교
            const endDate = new Date(endValue.trim());
            if (isNaN(endDate.getTime())) {
                // endValue가 날짜로 파싱 안 될 경우 스킵
                continue;
            }
            
            const songLength = row[songTitleIndex].split(";").length;
            const imgLength = row[songImgIndex].split(";").length;
            
            if (now < endDate && endDate < latestEndDate && songLength > imgLength) {
                latestEndDate = endDate;
                targetIndex = i;
            }
        }

        const row = rows[targetIndex];
        const pollId = row[pollIdIndex];
        const songTitle = row[songTitleIndex].split(";");
        const exsistingImg = row[songImgIndex].split(";");
        let urls = [];
        urls = urls.concat(exsistingImg);

        const buffer = await createTodaySongImg(pollId, exsistingImg.length);
        const filename = `today-song/song_${pollId}_${exsistingImg.length}.png`;
        await bucket.file(filename).save(buffer, {
            contentType: "image/png",
            public: true, // public URL로 접근할 수 있게
            metadata: {
                cacheControl: "public, max-age=31536000",
            },
        });
        const url = `https://storage.googleapis.com/${
            bucket.name
        }/${encodeURIComponent(filename)}`;
        urls.push(url);

        const songsUrl = urls.join(";");
        await updateTodaySongs(pollId, songsUrl);
        return { success: true, updatedPollId: pollId, updatedUrl: songsUrl };
    } catch (err) {
        console.error("runCronGenerateResultImage Error:", err);
        return { success: false, error: err.message };
    }
}