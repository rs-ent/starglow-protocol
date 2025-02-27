import { NextResponse } from "next/server";
import { runCronMarketing } from "../../scripts/cron-auto-marketing";

export async function GET(){
    try {
        const marketing = await runCronMarketing();
        console.log("runCronMarketing done:", marketing);
        return NextResponse.json({
            success: true,
            marketing
        });
    } catch (error) {
        console.error("/api/cron-marketing GET Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}