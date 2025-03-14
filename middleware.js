// middleware.js
import { NextResponse } from 'next/server';

const redirects = [
  { hostnames: ['docs.starglow.io'], destination: 'https://starglow.io/docs' },
  { hostnames: ['miniapp.starglow.io', 'mapp.starglow.io'], destination: 'https://starglow.io/start' },
];

export function middleware(request) {
    const url = request.nextUrl;

    for (const { hostnames, destination } of redirects) {
        if (hostnames.includes(url.hostname)) {
            return NextResponse.redirect(destination, 301);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
