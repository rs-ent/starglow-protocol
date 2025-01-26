import { getSheetsClient } from "../google-sheets/getSheetsClient";

export async function tweetScheduledRegister({ text, imageUrl, scheduledAt, poll_id }) {
    try {
      if (!text || !scheduledAt) {
        throw new Error("Missing text or scheduledAt");
      }
  
      const schedule_id = Math.random().toString(36).slice(2, 10);
      const sheets = getSheetsClient();
  
      // Poll Result Status 시트에 새 행 append
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
  
      return { success: true, schedule_id };
    } catch (error) {
      console.error("tweetScheduledRegister Error:", error);
      return { success: false, error: error.message };
    }
}