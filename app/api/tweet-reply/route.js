import { NextResponse } from "next/server";
import { runCronTweetReply } from "../../scripts/cron-auto-reply-tweet";

export async function GET() {
  try {
    const result = await runCronTweetReply();

    if (!result.success) {
      throw new Error(result.error || "Registration failed");
    }

    return NextResponse.json({
      success: true,
      tweetUrl: result.tweetUrl,
      processedCount: result.processedCount,
    });
  } catch (error) {
    console.error("tweet-reply Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
