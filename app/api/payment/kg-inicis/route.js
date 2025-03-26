/// app\api\payment\kg-inicis\route.js

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getNFTCollection } from "../../../firebase/nfts";
import { getUserDataByDocId } from "../../../firebase/user-data";
import { createPendingPayment } from "../../../firebase/payment";
import { krw_usd } from "../../../scripts/exchange";
import crypto from "crypto";

export async function POST(req) {
    const {
        productId,
        userId,
        quantity,
        currency
    } = await req.json();

    const nft = await getNFTCollection(productId);
    if (!nft) {
        return NextResponse.json({ error: "NFT not found." }, { status: 404 });
    }

    const requestedQuantity = parseInt(quantity, 10);
    const availableAmount = nft.availableAmount || nft.nft.length;
    if (isNaN(requestedQuantity) || requestedQuantity < 1 || requestedQuantity > availableAmount) {
        console.error("Invalid quantity", requestedQuantity, availableAmount);
        return NextResponse.json(
            { error: `Invalid quantity. Max available: ${availableAmount}` },
            { status: 400 }
        );
    }

    let currencyPayload = "WON";
    let languageView = "ko";
    const exchangeRate = await krw_usd();
    let productPrice = parseInt(nft.price / exchangeRate, 10);
    if (currency === "USD") {
        currencyPayload = "USD";
        languageView = "en";
        if (!exchangeRate) {
            return NextResponse.json({ error: "Failed to get exchange rate." }, { status: 500 });
        }
        productPrice = nft.price * 100;
    }
    const totalPrice = productPrice * requestedQuantity;
    console.log("Total price", totalPrice);
    const user = await getUserDataByDocId(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const oid = uuidv4();
    await createPendingPayment({
        oid,
        productId,
        productName: nft.name,
        buyerId: userId,
        buyerName: user.name || "",
        buyerEmail: user.email || "",
        buyerTel: user.phone || "",
        price: productPrice,
        quantity: requestedQuantity,
        totalPrice,
        currency
    });

    const mid = process.env.NEXT_PUBLIC_KG_MID;
    const signKey = process.env.KG_SIGN_KEY;
    const mKey = crypto.createHash("sha256")
        .update(signKey).digest("hex");
    const timestamp = Date.now();
    const signature = crypto.createHash("sha256")
        .update(`oid=${oid}&price=${totalPrice}&timestamp=${timestamp}`)
        .digest("hex");
    const verification = crypto.createHash("sha256")
        .update(`oid=${oid}&price=${totalPrice}&signKey=${signKey}&timestamp=${timestamp}`)
        .digest("hex");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const goodname = `${nft.name || ""} x${requestedQuantity || 1}`;

    return NextResponse.json({
        version: "1.0",
        mid,
        oid,
        price: totalPrice,
        timestamp,
        signature,
        verification,
        mKey,
        currency: currencyPayload,
        languageView,
        goodname,
        buyername: user.name || "",
        buyertel: user.phone || "",
        buyeremail: user.email || "",
        returnUrl: `${baseUrl}/api/payment/kg-inicis/return`,
        closeUrl: `${baseUrl}/payment/kg-inicis/close`,
        gopaymethod: "Card:DirectBank:VBank:HPP:Kpay:SamsungPay:Payco",
        acceptmethod: "HPP(1):below1000:centerCd(Y)"
    });

}