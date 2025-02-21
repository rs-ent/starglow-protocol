import { NextResponse } from "next/server";
import { runCronGeneratePollImage } from "../../scripts/cron-generate-today-poll";

export async function GET() {
   try {
    // 1) 투표 종료 후 결과 이미지 생성 + 10분 뒤 트윗 예약
    const generatePoll = await runCronGeneratePollImage();
    console.log("runCronGeneratePollImage done:", generatePoll);
    
    // 최종적으로 두 작업 결과를 함께 반환
    return NextResponse.json({
        success: true,
        generatePoll,
    });
   } catch (error) {
    console.error("/api/cron GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}