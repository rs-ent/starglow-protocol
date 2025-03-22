/// app\api\get-today-song\route.js

import { NextResponse } from "next/server";
import { createTodaySongImg } from "../../scripts/create-today-song-image";

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get("pollId") || "p1";
    const songIdx = searchParams.get("songIdx") || "0";

    // (1) 별도의 함수로 추출된 로직 호출
    const finalBuffer = await createTodaySongImg(pollId, songIdx);

    // (2) PNG 이미지(Binary)로 응답
    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Capture Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}