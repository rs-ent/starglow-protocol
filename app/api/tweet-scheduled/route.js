import { NextResponse } from "next/server";
import { tweetScheduledRegister } from "../../scripts/result-schedule-registration";

export async function POST(request) {
  try {
    const body = await request.json();
    // body = { text, imageUrl, scheduledAt, poll_id }
    const result = await tweetScheduledRegister(body);

    if (!result.success) {
      // 에러 발생
      throw new Error(result.error || "Registration failed");
    }

    return NextResponse.json({
      success: true,
      schedule_id: result.schedule_id
    });
  } catch (error) {
    console.error("schedule-tweet Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}