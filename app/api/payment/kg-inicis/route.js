/// app\api\payment\kg-inicis\route.js

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
    const {
        productName,
        productPrice,
        buyerName,
        buyerTel,
        buyerEmail,
    } = await req.json();

    const mid = process.env.NEXT_PUBLIC_KG_MID;
    const signKey = process.env.KG_SIGN_KEY;
    const mKey = crypto.createHash("sha256")
        .update(signKey).digest("hex");
    const oid = `order_${Date.now()}`;
    const price = productPrice;
    const timestamp = Date.now();
    const signature = crypto.createHash("sha256")
        .update(`oid=${oid}&price=${price}&timestamp=${timestamp}`)
        .digest("hex");
    const verification = crypto.createHash("sha256")
        .update(`oid=${oid}&price=${price}&signKey=${signKey}&timestamp=${timestamp}`)
        .digest("hex");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    return NextResponse.json({
        version: "1.0",
        mid,
        oid,
        price,
        timestamp,
        signature,
        verification,
        mKey,
        currency: "WON",
        goodname: productName,
        buyername: buyerName,
        buyertel: buyerTel,
        buyeremail: buyerEmail,
        returnUrl: `${baseUrl}/api/payment/kg-inicis/return`,
        closeUrl: `${baseUrl}/payment/kg-inicis/close`,
        gopaymethod: "Card",
        acceptmethod: "HPP(1):below1000"
    });

}