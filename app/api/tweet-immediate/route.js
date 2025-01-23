import { NextResponse } from "next/server";
import { getSheetsClient } from "../../google-sheets/getSheetsClient";
import { postTweet } from "../../scripts/post-tweet";

export async function POST(request) {
    try {
        const { text, imageUrl, scheduledAt, poll_id } = await request.json();
        if (!text) throw new Error("No text provided.");

        await postTweet(text, imageUrl);

        const schedule_id = Math.random().toString(36).slice(2, 10);

        const sheets = getSheetsClient();
        await sheets.spreadsheets.values.append({
            spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
            range: "Publishing Schedules!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[
                    schedule_id,
                    poll_id || "",
                    scheduledAt,
                    text,
                    imageUrl || "",
                    "done"  // status
                ]],
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("tweet-immediate Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}