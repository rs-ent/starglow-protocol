import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const pollId = searchParams.get("pollId") || "p1";

        //const targetUrl = `https://starglow-protocol.vercel.app/polls/${pollId}/result`;
        const targetUrl = `http://localhost:3000/polls/result?pollId=${pollId}`;
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1200,
            height: 1200,
            deviceScaleFactor: 4,
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
            omitBackground: true, // 투명 배경
        });

        await browser.close();

        return new NextResponse(screenshotBuffer, {
            headers: {
              "Content-Type": "image/png",
            },
        });
    } catch (error) {
        console.error("Capture Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};