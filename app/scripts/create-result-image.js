// app/scripts/create-result-image.js
import puppeteerLocal from "puppeteer"; 
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import sharp from "sharp";
import fs from "fs/promises";

export async function createResultImage(pollId) {
    let browser;
    if (process.env.NEXT_PUBLIC_BASE_URL === "https://starglow-protocol.vercel.app") {
        const path = await chromium.executablePath();
        console.log("Chromium path:", path);

        browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });
    } else {
        browser = await puppeteerLocal.launch({
            headless: "new",
        });
    }
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 1080, deviceScaleFactor: 1.8 });

    // 2) 타겟 URL 접속
    const targetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/polls/result?pollId=${pollId}`;
    await page.goto(targetUrl, { waitUntil: "networkidle0" });
    await page.evaluate(() => {
        document.body.style.background = "transparent";
    });

    // 3) 특정 DOM 요소 스크린샷
    const element = await page.$(".poll-card-result-wrapper");
    if (!element) {
        throw new Error("Element .poll-card-result-wrapper not found");
    }
    const screenshotBuffer = await element.screenshot({
        type: "png",
        omitBackground: true,
    });

    await browser.close();

    // 4) Sharp로 배경 합성
    const canvasWidth = 2560;
    const canvasHeight = 1985;

    const bgBuffer = await fs.readFile("./public/poll-result-bg.png");
    const baseBackground = await sharp(bgBuffer)
        .resize(canvasWidth, canvasHeight, { fit: "cover" })
        .png()
        .toBuffer();

    const { width, height } = await sharp(screenshotBuffer).metadata();
    const left = Math.floor((canvasWidth - (width || 0)) / 2);
    const top = Math.floor((canvasHeight - (height || 0)) / 2);

    const finalBuffer = await sharp(baseBackground)
        .composite([{ input: screenshotBuffer, left, top }])
        .png()
        .toBuffer();

    return finalBuffer;
}