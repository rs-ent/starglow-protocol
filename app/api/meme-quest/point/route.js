import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { telegramId, points } = body;

        if (!telegramId || telegramId === undefined) {
            return NextResponse.json(
                { error: 'Need a Telegram ID parameter' },
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

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('telegramId');

    if (!telegramId) {
        return NextResponse.json(
            { error: 'Need a Telegram ID parameter' },
            { status: 400 }
        );
    }

    const ADMIN_SECRET = process.env.NEXT_PUBLIC_MEMEQUEST_SECRET;
    const apiUrl = `https://api.meme-quest.xyz/starglow/points?telegramId=${encodeURIComponent(telegramId)}`;

    try {
        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'mquest-admin-secret': ADMIN_SECRET,
            },
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