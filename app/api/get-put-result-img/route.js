import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { createResultImage } from "../../scripts/create-result-image"; 
import { updateResultImgURL } from "../../scripts/update-result-image-url";

if (!admin.apps.length) {
  let serviceAccount = {};

  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVER_SERVICE_ACCOUNT_KEY || "{}");
  } catch (e) {
    console.warn("Failed parsing Firebase Service Account Key. Skipping admin initialization.", e.message);
  }

  if (serviceAccount && serviceAccount.project_id) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "gs://starglow-voting.firebasestorage.app",
    });
  } else {
    console.warn("Firebase Admin initialization skipped due to missing or invalid credentials.");
  }
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
    
        // (E) 결과 반환
        return NextResponse.json({
            success: true,
            pollId,
            finalURL,
            pollData,
            announcementText,
        });
    } catch (error) {
        console.error("get-put-result-img Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}