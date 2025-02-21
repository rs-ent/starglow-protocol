// app\scripts\cron-generate-today-song.js

import { getSheetsClient } from "../google-sheets/getSheetsClient";
import { createTodayPollImg } from "./create-today-poll-image";
import { updateTodayPoll } from "./update-today-poll-only";

export async function runCronGeneratePollImage() {
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
        const pollTitleIndex = header.indexOf("title");
        const pollOptionIndex = header.indexOf("options_shorten");
        const pollImgIndex = header.indexOf("poll_announce_img");
        if (endIndex === -1 || pollIdIndex === -1) {
            console.log("No 'end' or 'poll_id' column found in header");
            return { success: true, processed: 0 };
        }

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
            
            const pollTitle = row[pollTitleIndex];
            const pollOption = row[pollOptionIndex].split(";");
            const pollImg = row[pollImgIndex];
            
            if (now < endDate && endDate < latestEndDate && pollTitle && pollOption.length > 1 && !pollImg) {
                latestEndDate = endDate;
                targetIndex = i;
            }
        }

        const row = rows[targetIndex];
        const pollId = row[pollIdIndex];
        const buffer = await createTodayPollImg(pollId);
        if (!buffer) {
            throw new Error("Failed to create poll image");
        }
        const filename = `today-poll/poll_${pollId}.png`; 
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
    
        await updateTodayPoll(pollId, url);
        return { success: true, pollId: pollId, finalURL: url };
        
    } catch (err) {
        console.error("runCronGenerateResultImage Error:", err);
        return { success: false, error: err.message };
    }
}