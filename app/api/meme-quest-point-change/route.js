import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { telegramId, points } = body;

        if (!telegramId || telegramId === undefined) {
            return NextResponse.json(
                { error: 'telegramId points 값이 필요합니다.' },
                { status: 400 }
            );
        }

        const ADMIN_SECRET = process.env.NEXT_PUBLIC_MEMEQUEST_SECRET;
        const apiUrl = 'https://api.meme-quest.xyz/starglow/points';

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'mquest-admin-secret': ADMIN_SECRET,
            },
            body: JSON.stringify({ telegramId, points }),
        });

        const data = await apiResponse.json();
        return NextResponse.json(data, { status: apiResponse.status });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}