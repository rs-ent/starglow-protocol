import { TwitterApi } from "twitter-api-v2";
import sharp from "sharp";

export async function postTweetReply(text, imageUrl, tags = []) {
  console.log("TEXT:", text);
  console.log("MEDIA:", imageUrl);
  console.log("TAGS:", tags);

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  }).readWrite;

  let mediaId = null;
  if (imageUrl) {
    // 이미지 fetch 및 처리
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

  console.log("MEDIA ID:", mediaId);

  if (!tags || tags.length === 0) {
    return;
  }

  // 태그 배열에서 무작위 태그 선택 및 쿼리 생성
  const randomIndex = Math.floor(Math.random() * tags.length);
  const randomTag = tags[randomIndex];
  const query = `#${randomTag}`;

  try {
    // Twitter API v2의 검색 요청은 최소 max_results가 10이어야 하므로 10으로 요청합니다.
    const searchResult = await searchWithRetry(client, query, 10, 1);
    console.log("searchResult:", JSON.stringify(searchResult, null, 2));

    if (!searchResult || !searchResult.data || searchResult.data.length === 0) {
      console.log(`해시태그 ${query}에 해당하는 트윗을 찾지 못했습니다.`);
      return;
    }

    const tweets = searchResult.data.data;
    const randomTweetIndex = Math.floor(Math.random() * tweets.length);
    const tweetToReply = tweets[randomTweetIndex];
    console.log("tweetToReply: ", tweetToReply);
    if (!tweetToReply || !tweetToReply.id) {
      console.warn(`선택된 트윗이 유효하지 않습니다. (query: ${query})`);
      return;
    }
    const tweetId = tweetToReply.id;
    console.log(`해시태그 ${query} 관련 트윗 선택. 트윗 ID: ${tweetId}`);

    const replyOptions = {};
    if (mediaId) {
      replyOptions.media = { media_ids: [mediaId] };
    }

    const replyResponse = await client.v2.reply(text, tweetId, replyOptions);
    console.log(`트윗 ${tweetId}에 답글 전송 성공:`, replyResponse);

    const tweetUrl = `https://twitter.com/StarglowP/status/${replyResponse.data.id}`;
    return tweetUrl;
  } catch (error) {
    console.error(`해시태그 ${query} 처리 중 에러 발생:`, error);
  }
}

async function searchWithRetry(
  client,
  query,
  maxResults = 10,
  maxAttempts = 15,
  attempt = 1
) {
  try {
    const searchResult = await client.v2.search(query, {
      max_results: maxResults,
    });
    return searchResult;
  } catch (error) {
    if (error.code === 429 && attempt < maxAttempts) {
      let waitTime;
      if (error.rateLimit && error.rateLimit.reset) {
        const resetTime = error.rateLimit.reset * 1000;
        waitTime = Math.max(
          resetTime - Date.now(),
          Math.pow(2, attempt) * 1000
        );
      } else {
        waitTime = Math.pow(2, attempt) * 1000;
      }
      console.warn(
        `Rate limit exceeded. Retrying attempt ${attempt + 1} in ${
          waitTime / 1000
        } s.`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return await searchWithRetry(
        client,
        query,
        maxResults,
        maxAttempts,
        attempt + 1
      );
    } else {
      throw error;
    }
  }
}
