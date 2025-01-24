import { NextResponse } from "next/server";
import { getSheetsClient } from "../../google-sheets/getSheetsClient";

export async function POST(request) {
  try {
    const { pollId, finalURL } = await request.json();
    if (!pollId || !finalURL) {
      throw new Error("Missing pollId or finalURL");
    }

    const sheets = getSheetsClient();
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
      range: "Poll List!A:R",
    });

    const rows = readRes.data.values;
    if (!rows || rows.length === 0) {
      throw new Error("No data found in 시트1");
    }

    // (1) findIndex에 콜백 함수 사용
    const idCol = rows[0].findIndex(col => col === "poll_id");
    if (idCol === -1) {
      throw new Error(`No "poll_id" header found in row[0].`);
    }

    // (2) pollId와 같은 행 찾기
    const rowIndex = rows.findIndex(row => row[idCol] === pollId);
    if (rowIndex === -1) {
      throw new Error(`No row found for pollId: ${pollId}`);
    }

    // (3) "result_img" 열 찾기
    const imgCol = rows[0].findIndex(col => col === "result_img");
    if (imgCol === -1) {
      throw new Error(`No "result_img" header found in row[0].`);
    }

    // (4) 열 인덱스를 'A'~'Z'로 변환 (26열 미만 가정)
    const imgColStr = String.fromCharCode(65 + imgCol);
    // (5) 실제 시트 상의 행 번호 = rowIndex+1 (헤더가 1행)
    const updateRange = `List!${imgColStr}${rowIndex + 1}`;

    // (6) 해당 셀에 finalURL 저장
    await sheets.spreadsheets.values.update({
      spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[finalURL]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("put-result-img Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}