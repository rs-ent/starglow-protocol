// app\api\sui\execute-sponsored\route.js

import { EnokiClient } from '@mysten/enoki';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        console.log('Execute sponsored request body:', body);

        const enokiClient = new EnokiClient({
            apiKey: process.env.ENOKI_PRIVATE_API,
        });

        const { digest, signature } = body;

        try {
            const result = await enokiClient.executeSponsoredTransaction({
                digest,
                signature,
            });
            console.log('Execute sponsored result:', result);
            return NextResponse.json(result);
        } catch (error) {
            console.error('Detailed error:', JSON.stringify(error, null, 2));
            throw error;
        }
    } catch (error) {
        console.error('Error executing sponsored transaction:', error);
        console.error('Error details:', error.cause || error);
        return NextResponse.json({ error: error.message, details: error.cause?.message }, { status: 500 });
    }
}