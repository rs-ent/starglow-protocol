import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getSheetsData } from "../../scripts/google-sheets-data";
import { createTodaySongImg } from "../../scripts/create-today-song-image";
import { createTodayPollImg } from "../../scripts/create-today-poll-image";
import { updateToday } from "../../scripts/update-today-songs";
import { CreateAnnouncementText } from "../../scripts/create-announcemnet-text";
import { tweetScheduledRegister } from "../../scripts/result-schedule-registration";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVER_SERVICE_ACCOUNT_KEY || "{}"
  );
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

    const pollData = await getSheetsData();
    const poll = pollData[pollId];

    const songs = poll.song_title.split(";");
    let urls = [];
    for (var i = 0; i < songs.length; i++) {
      const buffer = await createTodaySongImg(pollId, i);
      const filename = `today-song/song_${pollId}_${i}.png`;
      await bucket.file(filename).save(buffer, {
        contentType: "image/png",
        public: true, // public URL로 접근할 수 있게
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });
      const url = `https://storage.googleapis.com/${
        bucket.name
      }/${encodeURIComponent(filename)}`;
      urls.push(url);
    }

    const songsUrl = urls.join(";");

    const pollBuffer = await createTodayPollImg(pollId);
    const pollFileName = `today-poll/poll_${pollId}.png`;
    await bucket.file(pollFileName).save(pollBuffer, {
      contentType: "image/png",
      public: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });
    const pollUrl = `https://storage.googleapis.com/${
      bucket.name
    }/${encodeURIComponent(pollFileName)}`;

    const message = CreateAnnouncementText(poll);

    // (D) 3) 구글 스프레드시트에 result_img 업데이트
    const { songsFinalUrl, pollFinalUrl, finalMessage } = await updateToday(
      pollId,
      songsUrl,
      pollUrl,
      message
    );

    /*const koreaTimeString = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
        const koreaTime = new Date(koreaTimeString);
        koreaTime.setHours(17, 30, 0, 0);
        const scheduledAt = toLocalInputString(koreaTime);

        const tweetRegisterRes = await tweetScheduledRegister({
            text: announcementText || "",
            imageUrl: finalURL,
            scheduledAt,
            poll_id: pollId,
        });*/

    // (E) 결과 반환
    return NextResponse.json({
      success: true,
      pollId,
      songsFinalUrl,
      pollFinalUrl,
    });
  } catch (error) {
    console.error("get-put-result-img Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
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
