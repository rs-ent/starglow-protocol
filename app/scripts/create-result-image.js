import sharp from "sharp";
import fs from "fs/promises";

export async function createResultImage(pollId) {

    let puppeteerImport, chromiumImport;
    if (process.env.NEXT_PUBLIC_BASE_URL === "http://localhost:3000") {
        // 개발환경
        puppeteerImport = await import("puppeteer");
        chromiumImport = null;
    } else {
        // 프로덕션(배포)환경
        puppeteerImport = await import("puppeteer-core");
        chromiumImport = await import("@sparticuz/chromium");
    }

    const puppeteer = puppeteerImport.default;
    const chromium = chromiumImport?.default;
    
    const executablePath = chromium
        ? await chromium.executablePath
        : undefined;

    const args = chromium ? chromium.args : [];
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath,
        args,
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1300, height: 1080, deviceScaleFactor: 1.8 });

    const targetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/polls/result?pollId=${pollId}`;
    await page.goto(targetUrl, { waitUntil: "networkidle0" });
    await page.evaluate(() => {
        document.body.style.background = "transparent";
    });

    const element = await page.$(".poll-card-result-wrapper");
    if (!element) {
        throw new Error("Element .poll-card-result-wrapper not found");
    }

    const screenshotBuffer = await element.screenshot({
        type: "png",
        omitBackground: true,
    });

    await browser.close();

    // 2) Sharp로 배경 합성
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