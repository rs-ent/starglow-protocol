import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import sharp from "sharp";
import fs from "fs/promises";

import { bucket } from "../../firebase/firebase-server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get("pollId") || "p1";

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1300,
      height: 1080,
      deviceScaleFactor: 1.8,
    });

    //const targetUrl = `http://localhost:3000/polls/result?pollId=${pollId}`;
    const targetUrl = `https://starglow-protocol.vercel.app/polls/result?pollId=${pollId}`;
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
    
    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Capture Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}