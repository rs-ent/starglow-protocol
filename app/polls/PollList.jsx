"use client";

import { useContext } from "react";
import { useMedia } from "react-use";
import { DataContext } from "../context/PollData";
import PollCard from "./PollCard";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PollList({pollResults}) {
    const pollContext = useContext(DataContext);
    const pollData = Object.values(pollContext).filter(function (poll) {
        if (poll.title && poll.options && poll.start && poll.end) return true;
        return false;
    }).sort(function (a, b) {
        const numA = parseInt(a.poll_id.replace('p',''), 10);
        const numB = parseInt(b.poll_id.replace('p',''), 10);
        return numB - numA;
    });
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

    const isDesktop = useMedia('(min-width: 440px)');
    return (
        <>
            {isDesktop ? (
                <div>
                    <Header />
                    <div className="bg-[url('/poll-bg-dt.png')] bg-top bg-no-repeat bg-fixed
                                bg-black bg-blend-multiply bg-opacity-15
                                items-center justify-center pb-64">
                        <div className="flex flex-col items-center text-center justify-center">
                            <h1 className="text-6xl mt-52 mb-3">
                                K-POP POLLS
                            </h1>
                            <h4 className="text-base mb-4">
                                by
                            </h4>
                            <Image
                                src='/starglow.png'
                                alt='STARGLOW LOGO'
                                width={200}
                                height={20}
                            />
                        </div>
                        <div className="min-h-screen grid grid-cols-3 gap-4 p-40 place-content-center place-items-center">
                            {pollData.map((poll) => (
                                <PollCard key={poll.poll_id} poll={poll} result={pollResults.find(p => p.id === poll.poll_id)} />
                            ))}
                        </div>
                        <div className="text-center mt-14">
                            <h1 className="text-5xl">
                                Wanna join for a vote?
                            </h1>
                            <a
                                href="https://t.me/starglow_redslippers_bot?start=r_vko5zj"
                                target="_blank"
                                rel="noreferrer"
                                className="button-base mt-12"
                            >
                                <Image 
                                    src='/ui/telegram-icon.png'
                                    alt='search-icon'
                                    width={17}
                                    height={17}
                                    className="mr-2"
                                />
                                Play STARGLOW
                            </a>
                        </div>
                    </div>
                    <div>
                        <Footer device={'desktop'} />
                    </div>
                </div>
            ) : (
                <div>
                    <Header />
                    <div className="bg-[url('/poll-bg.png')] bg-top bg-no-repeat bg-fixed
                                bg-black bg-blend-multiply bg-opacity-15
                                items-center justify-center pb-36">
                        <div className="flex flex-col items-center text-center justify-center">
                            <h1 className="text-5xl mt-48 mb-3">
                                K-POP POLLS
                            </h1>
                            <h4 className="text-sm mb-4">
                                by
                            </h4>
                            <Image
                                src='/starglow.png'
                                alt='STARGLOW LOGO'
                                width={180}
                                height={18}
                            />
                        </div>
                        <div className="min-h-screen grid grid-cols-1 gap-4 p-8 place-content-center place-items-center">
                            {pollData.map((poll) => (
                                <PollCard key={poll.poll_id} poll={poll} result={pollResults.find(p => p.id === poll.poll_id)} />
                            ))}
                        </div>

                        <div className="text-center mt-1 px-4">
                            <h1 className="text-4xl">
                                Wanna join for a vote?
                            </h1>
                            <a
                                href="https://t.me/starglow_redslippers_bot?start=r_vko5zj"
                                target="_blank"
                                rel="noreferrer"
                                className="button-base mt-12"
                            >
                                <Image 
                                    src='/ui/telegram-icon.png'
                                    alt='search-icon'
                                    width={17}
                                    height={17}
                                    className="mr-2"
                                />
                                Play STARGLOW
                            </a>
                        </div>
                    </div>

                    <div>
                        <Footer device={'mobile'} />
                    </div>
                </div>
            )}
        </>
    );
}