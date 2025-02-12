"use client";

import React, { useState, useContext } from "react";
import dynamic from 'next/dynamic';
import { useMedia } from "react-use";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Image from "next/image";
import Footer from "../components/Footer";
import PollCard from "./PollCard";
import { DataContext } from "../context/PollData";
import { clickAccessButton } from "../firebase/fetch";

const TABS = {
    ONGOING: "ongoing",
    ENDED: "ended",
    SCHEDULED: "scheduled",
};

const Header = dynamic(() => import('../components/Header'), { ssr: false });
export default function PollList({ pollResults }) {
    const pollContext = useContext(DataContext);
    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

    let ended = [];
    let onGoing = [];
    let scheduled = [];
    Object.values(pollContext)
        .sort(function (a, b) {
            const numA = parseInt(a.poll_id.replace('p', ''), 10);
            const numB = parseInt(b.poll_id.replace('p', ''), 10);
            return numB - numA;
        })
        .forEach(function (poll) {
            if (poll.title && poll.options && poll.start && poll.end && poll.poll_id && poll.poll_id !== 'p99999') {
                const startDate = parseAsKST(poll.start);
                const endDate = parseAsKST(poll.end);

                if (startDate > today && poll.show_scheduled === 'TRUE') scheduled.push(poll);
                else if (startDate <= today && today <= endDate) onGoing.push(poll);
                else if (today > endDate) ended.push(poll);
            }
        });

    const [activeTab, setActiveTab] = useState(TABS.ONGOING);
    function handleTabChange(tabKey) {
        setActiveTab(tabKey);
    }

    function handlePollClick() {
        const targetElement = document.getElementById('JoinForVote');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleAccessClick = async () => {
        let ipData = { ip: "unknown" };
        try {
            const res = await fetch("https://api.ipify.org?format=json");
            ipData = await res.json();

        } catch (err) {
            console.error("Failed", err);
        } finally{
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
            
            const type = "toMiniApp";
            clickAccessButton(deviceInfo, type);
        }
    }

    const isDesktop = useMedia("(min-width: 768px)") || false;

    return (
        <div className="bg-black">
            <Header />

            {/* 배경 및 최상단 영역 */}
            <div
                className="
                bg-[url('/poll-bg-dt.png')] bg-top bg-no-repeat bg-fixed
                bg-black bg-blend-multiply bg-opacity-15
                items-center justify-center pb-64
                "
            >
                {/* 타이틀 */}
                <div className="flex flex-col items-center text-center justify-center pb-32">
                    <h1 className="text-6xl mt-52 mb-3 px-4">K-POP POLLS</h1>
                    <h4 className="text-base mb-4">by</h4>
                    <Image
                        src="/starglow.png"
                        alt="STARGLOW LOGO"
                        width={200}
                        height={20}
                    />
                </div>

                {/* 탭 버튼 UI */}
                <div className="flex justify-center gap-4 text-white border-b border-gray-600 pb-2 mb-12"  >
                    <button
                        onClick={() => handleTabChange(TABS.ONGOING)}
                        className={`px-2 py-2 font-main text-sm ${activeTab === TABS.ONGOING ? "border-b-2 border-white" : ""
                            }`}
                    >
                        ONGOING
                    </button>
                    <button
                        onClick={() => handleTabChange(TABS.ENDED)}
                        className={`px-2 py-2 font-main text-sm ${activeTab === TABS.ENDED ? "border-b-2 border-white" : ""
                            }`}
                    >
                        ENDED
                    </button>
                    <button
                        onClick={() => handleTabChange(TABS.SCHEDULED)}
                        className={`px-2 py-2 font-main text-sm ${activeTab === TABS.SCHEDULED ? "border-b-2 border-white" : ""
                            }`}
                    >
                        SCHEDULED
                    </button>
                </div>

                {/* 탭별 컨텐츠 */}
                <div className="px-[10vw] pb-3 min-h-screen">
                    {activeTab === TABS.ONGOING && (
                        <>
                            <h1 className="text-2xl text-white mb-4">ONGOING</h1>
                            {isDesktop ? (
                                <LoadMoreList
                                    polls={onGoing}
                                    pollResults={pollResults}
                                    handlePollClick={handlePollClick}
                                />
                            ) : (
                                <MobileCarousel
                                    polls={onGoing}
                                    pollResults={pollResults}
                                    handlePollClick={handlePollClick}
                                />
                            )}
                        </>
                    )}

                    {activeTab === TABS.ENDED && (
                        <>
                            <h1 className="text-2xl text-white mb-4">ENDED</h1>
                            {isDesktop ? (
                                <LoadMoreList
                                    polls={ended}
                                    pollResults={pollResults}
                                    handlePollClick={handlePollClick}
                                />
                            ) : (
                                <MobileCarousel
                                    polls={ended}
                                    pollResults={pollResults}
                                    handlePollClick={handlePollClick}
                                />
                            )}
                        </>
                    )}

                    {activeTab === TABS.SCHEDULED && (
                        <>
                            <h1 className="text-2xl text-white mb-4">SCHEDULED</h1>
                            {isDesktop ? (
                                <LoadMoreList
                                    polls={scheduled}
                                    pollResults={pollResults}
                                    handlePollClick={handlePollClick}
                                    isBlur // 예정된 항목은 블러 처리 (옵션)
                                />
                            ) : (
                                <MobileCarousel
                                    polls={scheduled}
                                    pollResults={pollResults}
                                    handlePollClick={handlePollClick}
                                    isBlur
                                />
                            )}
                        </>
                    )}
                </div>

                {/* 하단 - 참여 유도 */}
                <div className="text-center mt-3" id="JoinForVote">
                    <div className="pt-24 mb-24" />
                    <h1 className="text-5xl text-white px-10">Wanna join for a vote?</h1>
                    <a
                        href="https://t.me/starglow_redslippers_bot?start=r_vko5zj"
                        target="_blank"
                        rel="noreferrer"
                        className="button-base mt-12 inline-flex items-center"
                        onClick={handleAccessClick}
                    >
                        <Image
                            src="/ui/telegram-icon.png"
                            alt="telegram-icon"
                            width={17}
                            height={17}
                            className="mr-2"
                        />
                        Play STARGLOW
                    </a>
                </div>
            </div>

            {/* 푸터 */}
            <Footer device={isDesktop ? "desktop" : "mobile"} />
        </div>
    );
}

function LoadMoreList({ polls, pollResults, handlePollClick, isBlur }) {
    const [limit, setLimit] = useState(6); // 처음에 6개씩만

    const displayed = polls.slice(0, limit);

    function loadMore() {
        setLimit((prev) => prev + 6);
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                {displayed.map((poll) => (
                    <div
                        key={poll.poll_id}
                        onClick={handlePollClick}
                        className={`cursor-pointer ${isBlur ? "blur-md" : ""}`}
                    >
                        <PollCard
                            poll={poll}
                            result={pollResults.find((p) => p.id === poll.poll_id)}
                        />
                    </div>
                ))}
            </div>

            {/* 표시한 개수 < 전체 개수일 때만 버튼 노출 */}
            {limit < polls.length && (
                <div className="flex justify-center mt-8">
                    <div className="rounded-full p-[1px] bg-gradient-to-br from-[rgba(255,255,255,1)] to-[rgba(0,0,0,0.5)]">
                        <button
                            onClick={loadMore}
                            className="px-6 py-2 rounded-full bg-gradient-to-br from-[rgba(0,0,5,1)] to-[#1c1c2d] text-white font-main"
                        >
                            MORE
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

/* 
  모바일 전용: react-slick 캐러셀 사용 
*/
function MobileCarousel({ polls, pollResults, handlePollClick, isBlur }) {
    // 슬라이더 설정
    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
    };

    return (
        <Slider {...settings} className="text-white">
            {polls.map((poll) => (
                <div key={poll.poll_id}>
                    <div
                        onClick={handlePollClick}
                        className={`p-4 cursor-pointer ${isBlur ? "blur-md" : ""}`}
                    >
                        <PollCard
                            poll={poll}
                            result={pollResults.find((p) => p.id === poll.poll_id)}
                        />
                    </div>
                </div>
            ))}
        </Slider>
    );
}

function parseAsKST(dateStrWithoutTZ) {
    return new Date(dateStrWithoutTZ.replace(" ", "T") + ":00+09:00");
}