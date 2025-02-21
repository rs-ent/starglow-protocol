import { google } from "googleapis";

export function getSheetsClient() {
  // 1) 환경 변수에서 JSON 키
  let serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (process.env.NEXT_PUBLIC_BASE_URL === "http://localhost:3000") {
    serviceAccountJson = serviceAccountJson.replace(/\n/g, "\\n");
  };
  if (!serviceAccountJson) {
    throw new Error("Service account key not found in env.");
  }
  const credentials = JSON.parse(serviceAccountJson);

  // 2) GoogleAuth 생성
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // 3) Sheets 인스턴스
  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}
