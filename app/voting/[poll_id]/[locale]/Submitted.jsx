"use client";

import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/PollData";
import { submitVote } from "../../../firebase/fetch";
import Image from "next/image";
import Countdown from './Countdown';
import LocaleFile from "./LocaleFile";

function parseAsKST(dateStrWithoutTZ) {
    return new Date(dateStrWithoutTZ.replace(" ", "T") + ":00+09:00");
}

export default function Submitted({ endDate , t }) {

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

    return (
        <div className="m-4 p-2 flex flex-col items-center justify-center">
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
            <a
                href="https://t.me/starglow_redslippers_bot"
                target="_blank"
                rel="noreferrer"
                className="button-base mt-16"
            >
                <Image 
                    src='/ui/share-icon.png'
                    alt='share-icon'
                    width={20}
                    height={20}
                    className="mr-2"
                />
                {t['poll']['shareFriend']}
            </a>
            <a
                href="https://t.me/starglow_redslippers_bot?start=r_vko5zj"
                target="_blank"
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
                className="button-black mt-4"
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

            <div className="mt-14 mb-2">
                <Image 
                    src='/sgt_logo.png'
                    alt='STARGLOW LOGO'
                    width={130}
                    height={130}
                />
            </div>
        </div>
    );
}