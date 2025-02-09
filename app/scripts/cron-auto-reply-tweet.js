import { getSheetsClient } from "../google-sheets/getSheetsClient";
import { postTweetReply } from "./post-tweet-reply";
import Papa from "papaparse";

export async function runCronTweetReply() {
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  const sheets = getSheetsClient();

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS7-XHjG1woLDYK1sUNEUmWUgormRv5GAckf9BS4LAuXcVoj_tA9jvBmhbr2FW8BGn6Lcarhlc3D6tV/pub?gid=905880846&single=true&output=csv";
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
  if (lines.length < 1) {
    return {
      success: true,
      message: "No data or just header.",
      processedCount: 0,
    };
  }

  let processedCount = 0;
  let tweetUrl = "";
  for (let i = 0; i < lines.length; i++) {
    const { START, END, TEXT, MEDIA, HASHTAGS, REPLIED, URL } = lines[i];
    console.log(lines[i]);
    console.log("====================");

    const startDate = parseKST(START);
    const endDate = parseKST(END);

    if (startDate <= today && endDate >= today) {
      const tags = HASHTAGS.split(";");
      tweetUrl = await postTweetReply(TEXT, MEDIA, tags);

      const rowIndex = i + 2;
      let repliedCount = parseInt(REPLIED !== "" ? REPLIED : 0, 10);
      const originalUrl = URL.split(";");
      const updatedUrl = originalUrl.push(tweetUrl);
      const updateData = [
        {
          range: `Auto Reply X!F${rowIndex}`,
          values: [[++repliedCount]],
        },
        {
          range: `Auto Reply X!G${rowIndex}`,
          values: [[updatedUrl.join(";")]],
        },
      ];

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
        requestBody: {
          data: updateData,
          valueInputOption: "USER_ENTERED",
        },
      });

      processedCount++;
    }
  }

  return { success: true, tweetUrl, processedCount };
}

function parseKST(dateStr) {
  const replaced = dateStr.replace(" ", "T") + ":00+09:00";
  return new Date(replaced);
}
