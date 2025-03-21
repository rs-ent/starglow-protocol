/// app\api\payment\kg-inicis\return\route.js

import { NextResponse } from "next/server";
import { updatePaymentStatus } from "../../../../firebase/payment";
import { TransferNFT } from "../../../../sui/nft-transaction";
import crypto from "crypto";

export async function POST(req) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const redirectUrl = new URL('/nft-store', baseUrl);
    console.log("Redirect URL:", redirectUrl.href);

    const formData = await req.formData();
    if (!formData || !formData.get('resultCode')) {
        console.error("No form data received");
        redirectUrl.searchParams.set('reason', 'TryAgain');
        return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    const resultCode = formData.get("resultCode");
    const resultMsg = formData.get("resultMsg");
    const orderNumber = formData.get("orderNumber") || formData.get("oid");
    const authToken = formData.get("authToken");
    const authUrl = formData.get("authUrl");
    const mid = formData.get("mid");

    if (resultCode !== "0000") {
        console.error("Payment failed", { resultCode, resultMsg });
        await updatePaymentStatus({ oid: orderNumber, tid: "", status: 'failed' });
        redirectUrl.searchParams.set('reason', resultMsg);
        redirectUrl.searchParams.set('oid', orderNumber);
        return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    const timestamp = Date.now();
    const signKey = process.env.KG_SIGN_KEY;

    const signature = crypto.createHash("sha256")
        .update(`authToken=${authToken}&timestamp=${timestamp}`)
        .digest("hex");

    const verification = crypto.createHash("sha256")
        .update(`authToken=${authToken}&signKey=${signKey}&timestamp=${timestamp}`)
        .digest("hex");

    const authPayload = new URLSearchParams({
        mid,
        authToken,
        timestamp: timestamp.toString(),
        signature,
        verification,
        charset: "UTF-8",
        format: "JSON"
    });

    let authResult;
    try {
        const res = await fetch(authUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: authPayload.toString(),
        });

        authResult = await res.json();
    } catch (err) {
        console.error("Auth request failed", err);
        await updatePaymentStatus({ oid: orderNumber, tid: "", status: 'failed' });
        redirectUrl.searchParams.set('reason', 'AuthRequestFailed');
        redirectUrl.searchParams.set('oid', orderNumber);
        return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    const { resultCode: authResultCode, resultMsg: authResultMsg, tid, TotPrice } = authResult;

    if (authResultCode === "0000") {
        await updatePaymentStatus({ oid: orderNumber, tid, status: 'paid' });
        const transferResponse = await TransferNFT(orderNumber);
        console.log("NFT transfer response:", transferResponse);
        if(!transferResponse.success) {
            console.error("NFT transfer failed");
            redirectUrl.searchParams.set('reason', 'NFTTransferFailed');
            redirectUrl.searchParams.set('oid', orderNumber);
            return NextResponse.redirect(redirectUrl, { status: 303 });
        }

        redirectUrl.searchParams.set('success', 'true');
        redirectUrl.searchParams.set('oid', orderNumber);
        redirectUrl.searchParams.set('tid', tid);
        return NextResponse.redirect(redirectUrl, { status: 303 });
    } else {
        console.error("Payment failed", { resultCode: authResultCode, resultMsg: authResultMsg });
        await updatePaymentStatus({ oid: orderNumber, tid: tid || "", status: 'failed' });
        redirectUrl.searchParams.set('reason', authResultMsg);
        redirectUrl.searchParams.set('oid', orderNumber);
        return NextResponse.redirect(redirectUrl, { status: 303 });
    }
}