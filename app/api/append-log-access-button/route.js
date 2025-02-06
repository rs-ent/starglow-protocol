import { NextResponse } from "next/server";
import { getSheetsClient } from "../../google-sheets/getSheetsClient";

export async function POST(req) {
    try {
        const { rowData } = await req.json();
        if (!rowData) throw new Error("No rowData provided");

        const nowKST = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
        );

        const year = nowKST.getFullYear();
        const month = String(nowKST.getMonth() + 1).padStart(2, "0");
        const day = String(nowKST.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const hours = String(nowKST.getHours()).padStart(2, "0");
        const minutes = String(nowKST.getMinutes()).padStart(2, "0");
        const seconds = String(nowKST.getSeconds()).padStart(2, "0");
        const timeStr = `${hours}:${minutes}:${seconds}`;

        const finalRow = [dateStr, timeStr, ...rowData];
    
        const sheets = getSheetsClient();
        await sheets.spreadsheets.values.append({
            spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
            range: "Access Count Log!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [finalRow] },
        });
        
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}