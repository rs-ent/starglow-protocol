import { NextResponse } from "next/server";
import { getSheetsClient } from "../../google-sheets/getSheetsClient";
import { postTweet } from "../../scripts/post-tweet";

export async function GET() {
    try {
        const sheets = getSheetsClient();

        const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS7-XHjG1woLDYK1sUNEUmWUgormRv5GAckf9BS4LAuXcVoj_tA9jvBmhbr2FW8BGn6Lcarhlc3D6tV/pub?gid=2862463&single=true&output=csv";
        const csvRes = await fetch(csvUrl);
        if (!csvRes.ok) {
            throw new Error("CSV fetch failed: " + csvRes.statusText);
        }

        const csvText = await csvRes.text();
        const lines = csvText.split("\n").map(line => line.trim());

        if (lines.length < 2) {
            return NextResponse.json({ success: true, message: "No data or just header." });
        }
        
        let processedCount = 0;
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(",");
            console.log('ROW: ', lines[i]);
            if (row.length < 6) continue;
            const [schedule_id, poll_id, scheduledAt, text, imageUrl, status] = row.map(col => col.trim());
            console.log('schedule_id: ', schedule_id);
            console.log('poll_id: ', poll_id);
            console.log('scheduledAt: ', scheduledAt);
            console.log('text: ', text);
            console.log('imageUrl: ', imageUrl);
            console.log('status: ', status);
            if (status === "pending") {
                const dateObj = new Date(scheduledAt);
                if (dateObj <= new Date()) {
                    
                    await postTweet(text, imageUrl);
                    console.log('Tweet success!');

                    const rowIndex = i + 1;
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
                        range: `Publishing Schedules!F${rowIndex}`,
                        valueInputOption: "USER_ENTERED",
                        requestBody: {
                            values: [["done"]],
                        },
                    });

                    processedCount++;
                }
            }
        }

        return NextResponse.json({ success: true, processed: processedCount });
        
    } catch (err) {
        console.error("CRON Error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}