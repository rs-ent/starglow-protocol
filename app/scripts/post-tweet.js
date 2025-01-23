import { TwitterApi } from "twitter-api-v2";
import sharp from "sharp";

export async function postTweet(text, imageUrl) {  
    const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,           
        appSecret: process.env.TWITTER_API_SECRET,     
        accessToken: process.env.TWITTER_ACCESS_TOKEN, 
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }).readWrite;

    let mediaId = null;
    if (imageUrl) {
        // Fetch image
        const res = await fetch(imageUrl);
        if (!res.ok) {
            throw new Error(`Could not fetch image: ${res.statusText}`);
        }

        const contentType = res.headers.get("content-type") || "image/png";
        const buffer = Buffer.from(await res.arrayBuffer());

        const compressedBuffer = await sharp(buffer)
        .resize({ width: 1080 })
        .png({ quality: 80 })
        .toBuffer();

        mediaId = await client.v1.uploadMedia(compressedBuffer, {
        mimeType: contentType,
        });
    }

    const postedTweet = await client.v2.tweet({
        text, 
        ...(mediaId ? { media: { media_ids: [mediaId] } } : {}),
    });

    return postedTweet;
};