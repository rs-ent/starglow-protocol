import { getSheetsClient } from "../google-sheets/getSheetsClient";
import { tweetScheduledRegister } from "./result-schedule-registration";

export async function runCronGenerateResultImage() {
    try {
      // (A) 현재 시각 - 5분 : end의 5분 후
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      const offsetTime = new Date(now.getTime() - 5 * 60 * 1000);
  
      // (B) 구글 시트 접근 (또는 CSV fetch)
      const sheets = getSheetsClient();
      const readRes = await sheets.spreadsheets.values.get({
        spreadsheetId: "1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4",
        range: "Poll List!A:R", // 시트 범위에 맞춰 수정
      });
      const rows = readRes.data.values;
      if (!rows || rows.length < 2) {
        console.log("No data or just header in sheet");
        return { success: true, processed: 0 };
      }
  
      // (C) 헤더에서 end / poll_id 열 인덱스 찾기
      const header = rows[0];
      const endIndex = header.indexOf("end");
      const pollIdIndex = header.indexOf("poll_id");
      const announceResultIndex = header.indexOf("announce_result");
      const resultImgIndex = header.indexOf("result_img");
      if (endIndex === -1 || pollIdIndex === -1) {
        console.log("No 'end' or 'poll_id' column found in header");
        return { success: true, processed: 0 };
      }
  
      let processed = 0;
  
      // (D) 실제 데이터 행 반복
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        // end, pollId 가져오기
        const endValue = row[endIndex];
        const pollId = row[pollIdIndex];
        if (!endValue || !pollId) continue;
  
        // 날짜 비교
        const endDate = new Date(endValue.trim());
        if (isNaN(endDate.getTime())) {
          // endValue가 날짜로 파싱 안 될 경우 스킵
          continue;
        }
  
        // (E) 조건: offsetTime >= endDate
        if (offsetTime >= endDate) {
          if (!row[announceResultIndex] || !row[resultImgIndex]) {
              console.log(`조건 충족: pollId=${pollId}, end=${endDate}, text=${row[announceResultIndex]}, img=${row[resultImgIndex]}`);
              
              // (F) /api/get-put-result-img 호출
              try {
                // 본인의 실제 배포 URL이 있으면 절대 경로를 써야 할 수도 있습니다
                const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
                const apiUrl = `${origin}/api/set-result?pollId=${pollId}`;
      
                const res = await fetch(apiUrl);
                if (!res.ok) {
                  console.error("set-result-img failed:", await res.text());
                } else {
                  const data = await res.json();
                  if (data.success) {
                    console.log(`Success for pollId=${pollId}, finalURL=${data.finalURL}`);
                    processed++;
                  } else {
                    console.error("API responded with error:", data.error);
                  }
                }
            } catch (err) {
              console.error("Error calling get-put-result-img:", err);
            }
          }
        }
      }
  
      return { success: true, processed };
    } catch (err) {
      console.error("runCronGenerateResultImage Error:", err);
      return { success: false, error: err.message };
    }
}