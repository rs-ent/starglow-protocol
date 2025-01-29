import { NextResponse } from "next/server";
import { runCronGenerateResultImage } from "../../scripts/cron-generate-result-image";
import { runCronTweetScheduler } from "../../scripts/cron-tweet-scheduler";

export async function GET() {
   try {
    // 1) 투표 종료 후 결과 이미지 생성 + 10분 뒤 트윗 예약
    const generateResult = await runCronGenerateResultImage();
    console.log("runCronGenerateResultImage done:", generateResult);
    
    // 2) 예약된 트윗 중 시각이 지난 것들을 트윗 발행
    const tweetScheduler = await runCronTweetScheduler();
    console.log("runCronTweetScheduler done:", tweetScheduler);

    // 최종적으로 두 작업 결과를 함께 반환
    return NextResponse.json({
        success: true,
        generateResult,
        tweetScheduler
    });
   } catch (error) {
    console.error("/api/cron GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}