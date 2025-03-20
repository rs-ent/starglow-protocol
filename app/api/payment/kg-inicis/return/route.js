/// app\api\payment\kg-inicis\return\route.js

export async function POST(req) {
    const formData = await req.formData();
    const resultCode = formData.get("resultCode");
    const resultMsg = formData.get("resultMsg");
    const tid = formData.get("tid");
    const oid = formData.get("MOID");
    const price = formData.get("TotPrice");
    const goodname = formData.get("goodname");

    if (resultCode === "0000") {
        console.log(`Payment success: ${goodname} ${price} ${oid} ${tid}`);
        return new Response("Payment is successful! Please close this window.", {status: 200});
    } else {
        console.error(`Payment failed: ${resultMsg}`);
        return new Response("Payment failed! Please try again.", {status: 400});
    }
}