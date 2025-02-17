"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../../context/PollData";

export default function TodaySong ({ poll, poll_id, songIdx = '0' }) {
    if (!poll_id || !poll || !poll.title){
        return <div></div>
    };
    
    const song = poll.song_title.split(';')[songIdx];
    const img = poll.song_img.split(';')[songIdx];

    const [fontSize, setFontSize] = useState(20);
    const [bigStroke, setBigStroke] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleResize() {
            if (!containerRef.current) return;
            const { width } = containerRef.current.getBoundingClientRect();

            const newFontSize = Math.max(65, Math.min(width / song.length * 1.15, 170));
            if(newFontSize > 90) setBigStroke(true);
            setFontSize(newFontSize);
        }
    
        handleResize();
    }, []);

    return (
        <div className="today-song-wrapper">
            <div className="text-center">
                <h2 className="text-[3.5rem] text-white ">
                    TODAY'S SONG
                </h2>

                <div
                    className="w-[97vw] flex justify-center mx-auto mt-6 mb-14"
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
                        <p
                            className={`${bigStroke ? "text-outline-6" : "text-outline-5"} text-center font-main-bold`}
                            style={{ fontSize }}
                        >
                            {song.toUpperCase()}
                        </p>

                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <div className="w-[44vw]"> 
                        <div className="relative">
                            <img
                                src="/sgt-logo-glow.png"
                                width={85}
                                height={85}
                                className="absolute top-[-38px] left-[43%] z-10"
                            />
                            <div className="card-frame p-[30px]
                                            border-[3px] border-[rgba(255,255,255,0.7)] rounded-[2.8rem]
                                            bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-[rgba(0,0,0,0.4)]
                                            glow-12 backdrop-blur-sm"
                            >
                                {img && (
                                    <div className="aspect-1 relative">
                                        <img
                                            src={img}
                                            alt={song}
                                            className="rounded-[1.5rem] w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center mt-8">
                                <img
                                    src="/today-song-components-2.png"
                                    className="relative"
                                    style={{width: '22vw'}}
                                    alt="Today Song Components"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}