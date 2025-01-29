import { getSheetsClient } from "../google-sheets/getSheetsClient";
import { postTweet } from "./post-tweet";
import Papa from 'papaparse';

export async function runCronTweetScheduler() {
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  
    const sheets = getSheetsClient();
  
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS7-XHjG1woLDYK1sUNEUmWUgormRv5GAckf9BS4LAuXcVoj_tA9jvBmhbr2FW8BGn6Lcarhlc3D6tV/pub?gid=2862463&single=true&output=csv";
    const csvRes = await fetch(csvUrl);
    if (!csvRes.ok) {
        throw new Error("CSV fetch failed: " + csvRes.statusText);
    }
  
    const csvText = await csvRes.text();
    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
    });

    const lines = parsed.data;
    if (lines.length < 2) {
        return { success: true, message: "No data or just header.", processedCount: 0 };
    }
    
    let processedCount = 0;
    for (let i = 0; i < lines.length; i++) {
        const {schedule_id, poll_id, scheduled_at, text, image_url, status} = lines[i];
        console.log(lines[i]);
        console.log("====================");
  
        if (status === "pending") {
            console.log("Status is Pending, Try upload");
            const dateObj = parseKST(scheduled_at);
            console.log("Date Object:", dateObj);
            console.log("Today:", today);
  
            if (dateObj <= today) {
                console.log("Today >= Date Object:", today, dateObj);
                await postTweet(text, image_url);
                console.log("Tweet success!");
  
                const rowIndex = i + 2;
                console.log(`Poll Result Status!F${rowIndex}`);
                await sheets.spreadsheets.values.update({
                    spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
                    range: `Poll Result Status!F${rowIndex}`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: {
                        values: [["done"]],
                    },
                });
  
                processedCount++;
            }
        }
    }
  
    return { success: true, processedCount };
}

function parseKST(dateStr) {
    const replaced = dateStr.replace(" ", "T") + ":00+09:00";
    return new Date(replaced);
}