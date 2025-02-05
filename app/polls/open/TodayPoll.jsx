"use client";

import React, { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../../context/PollData";
import { Textfit } from "react-textfit";

export default function TodaySong ({ poll_id, songIdx = '0' }) {
    const pollData = useContext(DataContext);
    const poll = pollData?.[poll_id];
    
    if (!poll_id || !poll || !poll.title){
        return <div></div>
    };

    const title = poll.title;
    const optionsData = poll.options_shorten || poll.options;
    let options = optionsData.split(';');

    let optionsTest = [
        'YesYesYes',
        'NoWay',
        'Noooo'
    ]

    const img = poll.img;

    const [fontSize, setFontSize] = useState(20);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleResize() {
            if (!containerRef.current) return;
            const { width } = containerRef.current.getBoundingClientRect();

            const newFontSize = Math.max(75, Math.min(width / (title.length * 0.35), 85));
            console.log("newFontSize", newFontSize, width / (title.length * 0.35));
            setFontSize(newFontSize);
        }
    
        handleResize();
    }, []);

    return (
        <div className="today-poll-wrapper">
            <div className="text-center">
                <h2 className="text-[3.5rem] text-white ">
                    #{poll_id.replace('p','')} TODAY'S POLL
                </h2>

                <div
                    className="w-[98vw] flex justify-center mx-auto mt-6 mb-14 px-2 py-2"
                    ref={containerRef}
                >
                    <div
                        style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1.1,
                        }}
                    >
                        <p className="text-outline-5-purple-glassblack text-center font-main-bold" style={{ fontSize }}>
                            {title.toUpperCase()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                    <div className="w-[48vw]">
                        <div className="relative">
                            <img
                                src="/sgt-logo-glow.png"
                                width={85}
                                height={85}
                                className="absolute top-[-38px] left-[43%] z-10"
                            />
                            {img && (
                                <div className="aspect-[2.0625/1] p-[1.2px]
                                    rounded-[15px]
                                    bg-gradient-to-br from-[rgba(255,255,255,0.4)] to-[rgba(255,255,255,0.1)]
                                    glow-12 backdrop-blur-sm"
                                >
                                    <div className="bg-gradient-to-br from-[rgba(31,32,43,1.0)] to-[rgba(0,0,0,1.0)] pt-[40px] pb-[20px] px-[20px] rounded-[15px]">
                                        <div className="relative">
                                            <img
                                                src={img}
                                                alt={title}
                                                className="rounded-[15px] w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-8 w-[80vw]">
                        <Textfit
                            mode="single"
                            className="w-[90%] my-2"
                            max={36}
                            min={28}
                        >
                            <div className="inline-block bg-[rgba(217,217,217,0.35)] rounded-full px-[80px] py-[16px] font-main">
                                {options.map((option, index) => (
                                <React.Fragment key={index}>
                                    {option}
                                    {index < options.length - 1 && (
                                    <span style={{ fontSize: '28px', margin: '0 20px' }}>vs</span>
                                    )}
                                </React.Fragment>
                            ))}
                            </div>
                        </Textfit>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function formatDate(str) {
    const [datePart] = str.split(" ");
    const [yyyy, mm, dd] = datePart.split("-");
    const yy = yyyy.slice(-2);
    return `${mm}/${dd}/${yy}`;
}