import { NextResponse } from "next/server";
import { runCronGenerateSongImages } from "../../scripts/cron-generate-today-song";

export async function GET() {
   try {
    // 오늘의 노래 이미지 생성 작업 실행
    const generateSongs = await runCronGenerateSongImages();
    console.log("runCronGenerateSongImages done:", generateSongs);
    
    // 결과 반환
    return NextResponse.json({
        success: true,
        generateSongs,
    });
   } catch (error) {
    console.error("/api/cron GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}