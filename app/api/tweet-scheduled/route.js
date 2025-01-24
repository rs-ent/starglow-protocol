import { NextResponse } from "next/server";
import { getSheetsClient } from "../../google-sheets/getSheetsClient";

export async function POST(request) {
    try {
        const { text, imageUrl, scheduledAt, poll_id } = await request.json();
        if (!text || !scheduledAt) {
            throw new Error("Missing text or scheduledAt");
        }

        const schedule_id = Math.random().toString(36).slice(2, 10);

        const sheets = getSheetsClient();
        await sheets.spreadsheets.values.append({
            spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
            range: "Poll Result Status!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[
                    schedule_id,
                    poll_id || "",
                    scheduledAt,
                    text,
                    imageUrl || "",
                    "pending"  // status
                ]],
            },
        });
        return NextResponse.json({ success: true, schedule_id });
    } catch (error) {
        console.error("schedule-tweet Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}