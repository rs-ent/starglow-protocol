"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { DataContext } from "../../../context/PollData";
import { submitVote } from "../../../firebase/fetch";
import Image from "next/image";
import Countdown from './Countdown';
import Submitted from "./Submitted";

function parseAsKST(dateStrWithoutTZ) {
    return new Date(dateStrWithoutTZ.replace(" ", "T") + ":00+09:00");
}

export default function Poll({ poll_id, t }) {
    const router = useRouter();

    const [voted, setVoted] = useState(false);
    const [selection, setSelection] = useState(-1);

    const pollData = useContext(DataContext);
    const poll = pollData?.[poll_id];
    if (!poll_id || !poll || !poll.title){
        router.replace('/polls');
        return <div></div>
    }

    const options = poll.options ? poll.options.split(";") : [];

    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const startDate = parseAsKST(poll.start);
    const endDate = parseAsKST(poll.end);

    if (today < startDate) {
        router.replace('/polls');
        return <div></div>
    }
    if (today > endDate) {
        return (
            <div>
                <h1 className="text-xl text-gradient">
                    {t['poll']['ended']}
                </h1>
            </div>
        );
    }

    if (voted) {
        return <Submitted poll_id={poll_id} title={poll.title} options={options} endDate={endDate} t={t} />
    }

    const handleOptionClick = (idx) => {
        setSelection(idx);
    }

    const handleSubmit = async (option) => {
        let ipData = { ip: "unknown" };
        try {
            const res = await fetch("https://api.ipify.org?format=json");
            ipData = await res.json();
        } catch (err) {
            console.error("Failed to get IP address:", err);
        }

        const deviceInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio,
            ipAddress: ipData.ip,
        };    

        await submitVote(poll_id, option, deviceInfo);
        setVoted(true);
    }

    return (
        <div className="m-4 p-2 flex flex-col min-h-screen items-center justify-center">
            <div className="relative items-center justify-center">
                <h1 className="text-center text-base text-outline-1 mt-10">
                    {t['poll']['openIn']}
                </h1>
                <h1 className="text-center text-4xl text-outline-1">
                    <Countdown endDate={endDate} />
                </h1>
                <h1 className="text-3xl px-3 text-white text-glow-3 text-center mt-14">
                    {poll.title || ""}
                </h1>

                {poll.img && (
                    <Image
                        src={poll.img}
                        alt={poll.title}
                        width={500}
                        height={300}
                        unoptimized
                        className="rounded-3xl shadow-md mt-10"
                    />
                )}

                <div className="grid grid-cols-1 gap-3 mt-6 p-2">
                    {options.map((option, idx) => (
                        <div 
                            key={idx}
                            onClick={() => handleOptionClick(idx)}
                            className="flex h-auto items-center rounded-xl inner-shadow-strong
                                      px-4 py-3 glow-12
                                    bg-[rgba(0,0,0,0.15)] text-[rgba(255,255,255,1)]"
                        >
                            <Image
                                src={selection === idx ? '/ui/button-select.png' : '/ui/button-unselect.png'}
                                alt={option}
                                width={19}
                                height={19}
                                className="mr-3 drop-shadow-md"
                            />
                            <h1 className="text-lg drop-shadow-md text-add-outline-1 text-[rgba(255,255,255,0.95)]">
                                {option}
                            </h1>
                        </div>
                    ))}
                </div>

                
            </div>
            <button
                className={`
                    button-base mt-6 mb-16
                    transition-all duration-500 ease-out transform
                    ${selection > -1 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10 pointer-events-none'
                    }
                `}
                onClick={() => handleSubmit(selection)}
                >
                {t['poll']['submit']}
            </button>

            <div className="mt-auto flex justify-center mb-4">
                <Image src="/sgt_logo.png" alt="STARGLOW LOGO" width={130} height={130} />
            </div>
        </div>
    );
}