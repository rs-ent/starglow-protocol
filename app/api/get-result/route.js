import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import sharp from "sharp";
import fs from "fs/promises";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get("pollId") || "p1";

    const targetUrl = `https://starglow-protocol.vercel.app/polls/${pollId}/result`;
    //const targetUrl = `http://localhost:3000/polls/result?pollId=${pollId}`;

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1200,
      deviceScaleFactor: 2,
    });

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
    const canvasHeight = 1984;

    const bgBuffer = await fs.readFile("./public/today-bg.png");
    let background = sharp(bgBuffer)
      .resize(canvasWidth, canvasHeight, { fit: "cover" })
      .png();

    const particlesBuffer = await fs.readFile("./public/particles.png");
    const rotatedParticles = await sharp(particlesBuffer)
      .rotate(15, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(canvasWidth, canvasHeight, { fit: "cover" })
      .png()
      .toBuffer();

    const bgWithParticles = await background
      .composite([
        {
          input: rotatedParticles,
          left: 0,
          top: 0,
        },
      ])
      .toBuffer();

    const { width, height } = await sharp(screenshotBuffer).metadata();
    const left = Math.max(0, Math.floor((canvasWidth - (width || 0)) / 2));
    const top = Math.max(0, Math.floor((canvasHeight - (height || 0)) / 2));

    const finalBuffer = await sharp(bgWithParticles)
      .composite([
        {
          input: screenshotBuffer,
          left,
          top,
        },
      ])
      .toBuffer();

    return new NextResponse(finalBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Capture Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}