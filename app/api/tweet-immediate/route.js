import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { getSheetsClient } from "../../google-sheets/getSheetsClient";

export async function POST(request) {
    try {
        const { text, imageUrl, scheduledAt, poll_id } = await request.json();
        if (!text) throw new Error("No text provided.");

        const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        });

        let mediaId = null;
        if (imageUrl) {
            const res = await fetch(imageUrl);
            const buffer = Buffer.from(await res.arrayBuffer());
            mediaId = await client.v1.uploadMedia(buffer, { type: "png" });
        }

        const tweetParams = {
            status: text,
            ...(mediaId && { media_ids: [mediaId] }),
        };
        const tweet = await client.v1.tweet(tweetParams);

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

        return NextResponse.json({ success: true, tweet });
    } catch (error) {
        console.error("tweet-immediate Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}