import { google } from "googleapis";

export function getSheetsClient() {
  // 1) 환경 변수에서 JSON 키
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error("Service account key not found in env.");
  }
  const fixedServiceAccountJson = serviceAccountJson.replace(
    /(\r\n|\n|\r)/g,
    "\\n"
  );
  const credentials = JSON.parse(fixedServiceAccountJson);

  // 2) GoogleAuth 생성
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // 3) Sheets 인스턴스
  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}
