import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { createResultImage } from "../../scripts/create-result-image"; 
import { updateResultImgURL } from "../../scripts/update-result-image-url";
import { tweetScheduledRegister } from "../../scripts/result-schedule-registration";

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVER_SERVICE_ACCOUNT_KEY || "{}");
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "gs://starglow-voting.firebasestorage.app", 
    });
}

const bucket = admin.storage().bucket();
const db = admin.firestore();

export async function GET(request) {
    try {
        // (A) pollId 추출
        const { searchParams } = new URL(request.url);
        const pollId = searchParams.get("pollId") || "p1";

        const docRef = db.collection("polls").doc(pollId);
        const snapshot = await docRef.get();
        let pollData;
        if (!snapshot.exists) {
            console.warn(`'polls/${pollId}' 문서를 찾지 못했습니다.`);
        } else {
            pollData = snapshot.data();
            console.log("Firestore에서 가져온 pollData:", pollData);
        }
    
        // (B) 1) 결과 이미지 생성 (Puppeteer + Sharp)
        const finalBuffer = await createResultImage(pollId);
    
        // (C) 2) Firebase Storage에 업로드
        // 예) poll-results 폴더 아래 "poll_{pollId}.png"
        const filename = `poll-results/poll_${pollId}.png`;
        await bucket.file(filename).save(finalBuffer, {
            contentType: "image/png",
            public: true,  // public URL로 접근할 수 있게
            metadata: {
            cacheControl: "public, max-age=31536000",
            },
        });
        const finalURL = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filename)}`;
    
        // (D) 3) 구글 스프레드시트에 result_img 업데이트
        const {url, announcementText} = await updateResultImgURL(pollId, finalURL, pollData);

        const koreaTimeString = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const koreaTime = new Date(koreaTimeString);
        koreaTime.setHours(17, 30, 0, 0);
        const scheduledAt = toLocalInputString(koreaTime);

        const tweetRegisterRes = await tweetScheduledRegister({
            text: announcementText || "",
            imageUrl: finalURL,
            scheduledAt,
            poll_id: pollId,
        });
    
        // (E) 결과 반환
        return NextResponse.json({
            success: true,
            pollId,
            finalURL,
            pollData,
            announcementText,
            tweetRegisterRes,
        });
    } catch (error) {
        console.error("get-put-result-img Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

function parseAsKST(dateStrWithoutTZ) {
    return new Date(dateStrWithoutTZ.replace(" ", "T") + ":00+09:00");
}

function toLocalInputString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}