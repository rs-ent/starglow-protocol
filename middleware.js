// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = request.nextUrl;

    if (url.hostname === 'docs.starglow.io') {
        return NextResponse.redirect('https://starglow.io/docs', 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
