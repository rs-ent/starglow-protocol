import { getSheetsClient } from "../google-sheets/getSheetsClient";

export async function updateToday(pollId, songsUrl, pollUrl, message) {
  if (!pollId || !songsUrl) {
    throw new Error("Missing pollId or songsUrl");
  }

  const sheets = getSheetsClient();
  const readRes = await sheets.spreadsheets.values.get({
    spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
    range: "Poll List!A:P",
  });

  const rows = readRes.data.values;
  if (!rows || rows.length === 0) {
    throw new Error("No data found in 'Poll List'");
  }

  // (1) poll_id 열 찾기
  const idCol = rows[0].findIndex((col) => col === "poll_id");
  if (idCol === -1) {
    throw new Error(`No "poll_id" header found in row[0].`);
  }

  // (2) pollId 행 찾기
  const rowIndex = rows.findIndex((row) => row[idCol] === pollId);
  if (rowIndex === -1) {
    throw new Error(`No row found for pollId: ${pollId}`);
  }

  // (3) result_img 열 인덱스
  const imgCol = rows[0].findIndex((col) => col === "song_announce_img");
  if (imgCol === -1) {
    throw new Error(`No "song_announce_img" header found in row[0].`);
  }

  const pollCol = rows[0].findIndex((col) => col === "poll_announce_img");
  if (pollCol === -1) {
    throw new Error(`No "poll_announce_img" header found in row[0].`);
  }

  const msgCol = rows[0].findIndex((col) => col === "announce_today");
  if (msgCol === -1) {
    throw new Error(`No "announce_today" header found in row[0].`);
  }

  // (4) 열 인덱스를 A~Z로 (26열 미만 가정)
  const imgColStr = String.fromCharCode(65 + imgCol);
  const pollColStr = String.fromCharCode(65 + pollCol);
  const msgColStr = String.fromCharCode(65 + msgCol);

  // (5) 실제 시트 상의 행 번호 = rowIndex + 1 (헤더가 1행)
  const updateData = [
    {
      range: `Poll List!${imgColStr}${rowIndex + 1}`,
      values: [[songsUrl]],
    },
    {
      range: `Poll List!${pollColStr}${rowIndex + 1}`,
      values: [[pollUrl]],
    },
    {
      range: `Poll List!${msgColStr}${rowIndex + 1}`,
      values: [[message]],
    },
  ];

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
    requestBody: {
      data: updateData,
      valueInputOption: "USER_ENTERED",
    },
  });

  return { songsUrl };
}
