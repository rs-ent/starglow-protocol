import { NextResponse } from "next/server";
import { updateResultImgURL } from "../../scripts/update-result-image-url";

export async function POST(request) {
  try {
    // 1) pollId, finalURL 가져오기
    const { pollId, finalURL } = await request.json();

    // 2) updateResultImgURL 호출
    const updatedURL = await updateResultImgURL(pollId, finalURL);

    // 3) 성공 응답
    return NextResponse.json({ success: true, url: updatedURL });
  } catch (error) {
    console.error("put-result-img Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}