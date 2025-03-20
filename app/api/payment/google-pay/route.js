/// app\api\payment\google-pay\route.js

export async function POST(request) {
    try {
        const { token, paymentData, userData, formData } = await request.json();

        console.log("Google Pay Token", token);
        console.log("Payment Data", paymentData);
        console.log("User Data", userData);
        console.log("Form Data", formData);

        // Do something with the payment data

        return Response.json({ success: true, message: "Payment successful" }, {status: 200});
    } catch (error) {
        console.error("Google Pay error", error);
        return Response.json({ success: false, message: "Payment failed" }, {status: 500});
    }
}

export async function GET(request) {
    return Response.json({ message: "Google Pay API supports POST only." }, {status: 405});
}