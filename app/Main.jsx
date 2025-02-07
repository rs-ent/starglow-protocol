"use client";

import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./components/Header'), { ssr: false });
const Body = dynamic(() => import('./components/Body'), { ssr: false });

export default function Main() {
    return (
        <div className="bg-black overflow-x-clip">
            <Header />
            <Body />
        </div>
    );
}