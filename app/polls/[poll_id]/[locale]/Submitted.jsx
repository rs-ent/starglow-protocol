"use client";

import Image from "next/image";
import Countdown from './Countdown';
import { useCallback } from 'react';

function parseAsKST(dateStrWithoutTZ) {
    return new Date(dateStrWithoutTZ.replace(" ", "T") + ":00+09:00");
}

export default function Submitted({ poll_id, endDate , t }) {

    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

    if (today > endDate) {
        return (
            <div>
                <h1 className="text-xl text-gradient">
                    {t['poll']['ended']}
                </h1>
            </div>
        );
    }

    const handleShare = useCallback(async () => {
        const shareUrl = `https://starglow-protocol.vercel.app/polls/${poll_id}`;
    
        try {
            await navigator.clipboard.writeText(shareUrl);
    
            if (navigator.share) {
                await navigator.share({
                    title: 'Starglow Poll',
                    text: 'Check out this poll!',
                    url: shareUrl,
                });
            } else {
                alert('The Link has been Copied to Clipboard!');
            }
        } catch (error) {
            console.error('Sharing failed', error);
        }
    }, [poll_id]);

    return (
        <div className="m-4 p-2 flex flex-col min-h-screen items-center justify-center">
            <div className="relative items-center justify-center">
                <h1 className="text-center text-base text-outline-1 mt-10">
                    {t['poll']['openInX']}
                </h1>
                <h1 className="text-center text-6xl text-outline-1">
                    <Countdown endDate={endDate} />
                </h1>
                <h1 className="text-3xl whitespace-pre-wrap text-center mt-16 px-3">
                    {t['poll']['yay']}
                </h1>
            </div>
            <button
                type="button"
                onClick={handleShare}
                className="button-base mt-16"
                style={{ display: 'flex', alignItems: 'center' }}
            >
                <Image 
                    src='/ui/share-icon.png'
                    alt='share-icon'
                    width={19}
                    height={19}
                    className="mr-2"
                />
                {t['poll']['shareFriend']}
            </button>
            <a
                href="/polls"
                rel="noreferrer"
                className="button-base mt-4"
            >
                <Image 
                    src='/ui/search-icon.png'
                    alt='search-icon'
                    width={17}
                    height={17}
                    className="mr-2"
                />
                {t['poll']['discoverMore']}
            </a>
            <a
                href="https://x.com/StarglowP"
                target="_blank"
                rel="noreferrer"
                className="button-black mt-4 mb-16"
            >
                <Image 
                    src='/ui/x-icon.png'
                    alt='search-icon'
                    width={15}
                    height={15}
                    className="mr-2"
                />
                {t['poll']['followStarglow']}
            </a>

            <div className="mt-auto flex justify-center mb-4">
                <Image src="/sgt_logo.png" alt="STARGLOW LOGO" width={130} height={130} />
            </div>
        </div>
    );
}