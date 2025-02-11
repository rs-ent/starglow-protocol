import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('telegramId');

    if (!telegramId) {
        return NextResponse.json(
            { error: 'telegramId 파라미터가 필요합니다.' },
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