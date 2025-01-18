export function parseSheetsDataToObject(csvArray) {
    if (!csvArray || csvArray.length === 0) {
      return {};
    }

    const [headerRow, ...dataRows] = csvArray;
  
    const headers = headerRow.map((h) => h.replace(/\r/g, "").trim());
  
    const result = {};
  
    dataRows.forEach((row) => {
      const cleanedRow = row.map((cell) => cell.replace(/\r/g, "").trim());
  
      const rowObj = {};
      headers.forEach((key, i) => {
        rowObj[key] = cleanedRow[i] || "";
      });
  
      const pollId = rowObj["poll_id"];
      if (pollId) {
        result[pollId] = rowObj;
      }
    });
  
    return result;
}

export async function getSheetsData() {
    const res = await fetch(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7-XHjG1woLDYK1sUNEUmWUgormRv5GAckf9BS4LAuXcVoj_tA9jvBmhbr2FW8BGn6Lcarhlc3D6tV/pub?gid=0&single=true&output=csv',
      {
        next: { revalidate: 60 },
      }
    );
    const csvData = await res.text();

    const rows = csvData.split("\n").map((row) => row.split(","));
    const result = parseSheetsDataToObject(rows);

    return result;
}