/// app\api\sui\shinami\zkProof\route.js

import { generateZkProofWithShinami } from "../../../../sui/utils";

export async function POST(req) {
    try {
        const {
            ephemeralPublicKey,
            userData,
            randomness,
            maxEpoch,
        } = await req.json();

        const zkProof = await generateZkProofWithShinami(ephemeralPublicKey, userData, randomness, maxEpoch);

        if (!zkProof) {
            return new Response(JSON.stringify({ success: false, error: "Failed to generate zkProof" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, zkProof }), { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}