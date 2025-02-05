import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getSheetsData } from "../../scripts/google-sheets-data";
import { createTodaySongImg } from "../../scripts/create-today-song-image";
import { createTodayPollImg } from "../../scripts/create-today-poll-image";
import { updateToday } from "../../scripts/update-today-songs";
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

        const pollData = await getSheetsData();
        const poll = pollData[pollId];

        const songs = poll.song_title.split(';');
        let urls = [];
        for(var i=0; i<songs.length; i++) {
            const buffer = await createTodaySongImg(pollId, i);
            const filename = `today-song/song_${pollId}_${i}.png`;
            await bucket.file(filename).save(buffer, {
                contentType: "image/png",
                public: true,  // public URL로 접근할 수 있게
                metadata: {
                    cacheControl: "public, max-age=31536000",
                },
            });
            const url = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filename)}`;
            urls.push(url);
        }
        
        const songsUrl = urls.join(';');

        const pollBuffer = await createTodayPollImg(pollId);
        const pollFileName = `today-poll/poll_${pollId}.png`;
        await bucket.file(pollFileName).save(pollBuffer, {
            contentType: "image/png",
            public: true,
            metadata: {
                cacheControl: "public, max-age=31536000",
            }
        });
        const pollUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(pollFileName)}`;

        const pollTitle = poll.title;
        const pollOptions = poll.options.split(';');

        const randomFinales = [
            "Open up the Starglow mini app and let us know! We're waiting for your opinion about it.\n\nJoin Starglow 😀",
            "Explore the Starglow mini app and share your thoughts with us! We can’t wait to hear from you.\n\nJoin Starglow 😃",
            "Dive into the Starglow mini app and tell us what you think! Your feedback is important to us.\n\nJoin Starglow 😄",
            "Try out the Starglow mini app and drop us your comments! We are eager to learn from you.\n\nJoin Starglow 😁",
            "Fire up the Starglow mini app and share your thoughts! We're excited to hear your feedback.\n\nJoin Starglow 😆",
            "Experience the magic of the Starglow mini app – your feedback lights up our day!\n\nJoin Starglow 😊",
            "Step into the world of Starglow and share your thoughts – we value every opinion!\n\nJoin Starglow 🙂",
            "Explore the Starglow mini app and let your voice be heard – your feedback is our inspiration.\n\nJoin Starglow 🥰",
            "Dive into the Starglow mini app and tell us what you love most – we can’t wait to hear from you!\n\nJoin Starglow 😘",
            "Give the Starglow mini app a try and share your experience with us – every thought counts.\n\nJoin Starglow 😙",
            "Uncover the hidden gems of the Starglow mini app and drop us your feedback – we’re excited to listen!\n\nJoin Starglow 😋",
            "Join us in exploring the Starglow mini app and share your perspective – your opinion matters.\n\nJoin Starglow 😝",
            "Check out the new features in the Starglow mini app and let us know what you think – your voice drives us!\n\nJoin Starglow 🤪",
            "Experience the ease of using the Starglow mini app and drop your thoughts – every feedback makes a difference.\n\nJoin Starglow 🥳",
            "Take a moment to explore the Starglow mini app and share your experience – we're eager to hear from you.\n\nJoin Starglow 🤗",
            "Step in and try the Starglow mini app – your honest opinion can spark innovation!\n\nJoin Starglow 😀",
            "Explore, engage, and let us know your thoughts on the Starglow mini app – every feedback is appreciated.\n\nJoin Starglow 😃",
            "Discover the possibilities with the Starglow mini app and tell us what you think – your insights matter.\n\nJoin Starglow 😄",
            "Give the Starglow mini app a spin and share your impressions – we're all ears for your feedback.\n\nJoin Starglow 😁",
            "Engage with the Starglow mini app today and let us know your thoughts – your feedback is our fuel.\n\nJoin Starglow 😆",
            "Experience innovation with the Starglow mini app and drop your feedback – your input makes us better.\n\nJoin Starglow 😆",
            "Try the Starglow mini app now and tell us your thoughts – every opinion counts.\n\nJoin Starglow 🙂",
            "Open the Starglow mini app and share your experience – your feedback brightens our path forward.\n\nJoin Starglow 😆",
            "Discover a new world in the Starglow mini app and let us know what you think – your voice matters.\n\nJoin Starglow 😘",
            "Check out the latest in the Starglow mini app and drop us a comment – we value your feedback.\n\nJoin Starglow 😆",
            "Take a tour of the Starglow mini app and tell us your favorite parts – your opinion guides us!\n\nJoin Starglow 😘",
            "Explore the exciting features of the Starglow mini app and share your insights – every detail counts.\n\nJoin Starglow 😆",
            "Dive into the features of the Starglow mini app and drop your thoughts – your feedback inspires us!\n\nJoin Starglow 😘",
            "Experience the future with the Starglow mini app and let us know what you think – your feedback is key.\n\nJoin Starglow 😆",
            "Step into innovation with the Starglow mini app and share your experience – every opinion shapes our journey.\n\nJoin Starglow 😘",
            "Open the Starglow mini app and give us your take on it – your insights make all the difference.\n\nJoin Starglow 😆",
            "Explore the intuitive design of the Starglow mini app and share your thoughts – we're eager for your feedback.\n\nJoin Starglow 😆",
            "Give the Starglow mini app a try and let us know your impressions – your feedback powers our progress.\n\nJoin Starglow 😆",
            "Experience the simplicity of the Starglow mini app and share your experience – your feedback is invaluable.\n\nJoin Starglow 😁",
            "Take the opportunity to try the Starglow mini app and drop your thoughts – we’re excited to hear from you!\n\nJoin Starglow 😆",
            "Step into the experience of the Starglow mini app and let us know your views – every comment counts.\n\nJoin Starglow 😊",
            "Engage with the innovative Starglow mini app and share what you think – your opinion drives us forward.\n\nJoin Starglow 😘",
            "Explore the creative side of the Starglow mini app and give us your feedback – we’re listening!\n\nJoin Starglow 😆",
            "Check out the Starglow mini app and tell us your thoughts – your feedback sparks our innovation.\n\nJoin Starglow 😁",
            "Open up the Starglow mini app and share your genuine opinion – every feedback helps us grow.\n\nJoin Starglow 😆",
            "Discover the benefits of the Starglow mini app and drop us your insights – your thoughts matter.\n\nJoin Starglow 🤪",
            "Experience a new way of connecting with the Starglow mini app and share your experience – your feedback inspires change.\n\nJoin Starglow 😆",
            "Take a look at the Starglow mini app and let us know your thoughts – your feedback lights our way.\n\nJoin Starglow 😆",
            "Embrace the innovation in the Starglow mini app and drop a comment – we value every opinion.\n\nJoin Starglow 😁",
            "Try out the Starglow mini app and share your honest feedback – your insights drive our creativity.\n\nJoin Starglow 🤪"
        ];

        const randomFinale = randomFinales[Math.floor(Math.random() * randomFinales.length)];
        const message = 
`🎵Today's Song🎵
💿 ${songs.join('\n💿 ')}


🗳Today's Poll🗳

[${poll.title}]
⚪️ ${pollOptions.join('\n⚪️ ')}

${randomFinale}
http://starglow.pro/start`
    
        // (D) 3) 구글 스프레드시트에 result_img 업데이트
        const {songsFinalUrl, pollFinalUrl, finalMessage} = await updateToday(pollId, songsUrl, pollUrl, message);

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