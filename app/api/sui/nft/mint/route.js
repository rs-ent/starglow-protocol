/// app\api\sui\nft\mint\route.js

import { NextResponse } from "next/server";
import { mintNFT } from "../../../../sui/nft-mint";

export async function POST(request) {
    try {
        const formData = await request.json();

        const result = await mintNFT(formData);

        if(!result.success) {
            return NextResponse.json({ success: false, error: result.error || result.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, result: result.result });
    } catch (error) {
        console.error('Error in mintNFT API:', error);
        return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
    }
}