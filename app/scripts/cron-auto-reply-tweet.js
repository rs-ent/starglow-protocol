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

  let targetList = [];
  for (let i = 0; i < lines.length; i++) {
    lines[i].rowIndex = i + 2;
    const startDate = parseKST(lines[i].START);
    const endDate = parseKST(lines[i].END);
    if (lines[i].TEXT && lines[i].HASHTAGS && startDate <= today && endDate >= today) {
      targetList.push(lines[i]);
    }
  }

  const targetIndex = Math.floor(Math.random() * targetList.length);
  const target = targetList[targetIndex];
  console.log("TARGET: ", target);
  
  const { START, END, TEXT, MEDIA, HASHTAGS, REPLIED, URL, rowIndex } = target;
  
  const tags = HASHTAGS.split(";");
  let tweetUrl = "";
  tweetUrl = await postTweetReply(TEXT, MEDIA, tags);
  if (!tweetUrl) {
    return { success: false, error: "Tweet failed" };
  }

  let repliedCount = parseInt(REPLIED !== "" ? REPLIED : 0, 10);
  const urls = URL.split(";");
  urls.push(tweetUrl);
  const updateData = [
    {
      range: `Auto Reply X!F${rowIndex}`,
      values: [[++repliedCount]],
    },
    {
      range: `Auto Reply X!G${rowIndex}`,
      values: [[urls.join(";")]],
    },
  ];

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
    requestBody: {
      data: updateData,
      valueInputOption: "USER_ENTERED",
    },
  });

  return { success: true, tweetUrl, target };
}

function parseKST(dateStr) {
  const replaced = dateStr.replace(" ", "T") + ":00+09:00";
  return new Date(replaced);
}
