"use client";

import { useContext } from "react";
import { DataContext } from "../../context/PollData";
import PollBarChart from "../PollBarChart";

export function formatDate(str) {
    const [datePart] = str.split(" ");
    const [yyyy, mm, dd] = datePart.split("-");
    const yy = yyyy.slice(-2);
    return `${mm}/${dd}/${yy}`;
}

export default function PollCardResult({ poll_id, result, bigFont = false }) {
    const pollData = useContext(DataContext);
    const poll = pollData?.[poll_id];
    if (!poll_id || !poll || !poll.title){
        router.replace('/polls');
        return <div></div>
    }
    
    const pollNumber = poll.poll_id.replace('p','');
    const options = poll.options.split(';');
    let voteResult = {}
    options.forEach(function (option, idx) {
        voteResult[idx] = 0;
    })

    let winner = '';
    if (result && result.votes) {
        voteResult = result.votes;
        const values = Object.values(voteResult);
        const maxValue = Math.max(...values); 
        const maxIndex = values.indexOf(maxValue); 
        winner = options[maxIndex];
    }

    return (
        <div className="poll-card-result-wrapper">
            <div className="text-center">
                <h2 className="text-5xl">
                    #{pollNumber} POLL RESULT
                </h2>
                <h1 className="text-8xl text-glow-strong mt-12 mb-20 px-10">
                    {winner}
                </h1>
            </div>
            <div className="card relative max-w-[580px] min-w-[440px] mx-auto">
                <img
                    src="/sgt-logo-glow.png"
                    width={80}
                    height={70}
                    className="
                        absolute
                        top-[-4px] left-1/2
                        -translate-x-1/2 
                        -translate-y-1/2
                        z-10
                    "
                />
                <div className="card-frame flex flex-col p-8
                                border border-[rgba(255,255,255,0.4)] rounded-3xl
                                bg-gradient-to-t from-[rgba(0,0,0,1)] to-[rgba(32,32,42,1)]
                                glow-12
                                ">
                    {poll.img && (
                        <div className="bg-gradient-to-br from-[rgba(255,255,255,0.8)] to-[rgba(255,255,255,0.1)] rounded-3xl p-[1px] shadow-sm">
                            <div className="bg-black rounded-3xl">
                                <div className="aspect-[2.0625/1] relative">
                                    <img
                                        src={poll.img}
                                        alt={poll.title}
                                        className="rounded-3xl shadow-md w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <h1 className="text-3xl mt-3">
                        #{poll.poll_id.replace('p','')}
                    </h1>
                
                    <h1 className="text-2xl">
                        {poll.title}
                    </h1>

                    <p className="text-sm text-[rgba(255,255,255,0.6)]">
                        {formatDate(poll.start)}~{formatDate(poll.end)}
                    </p>

                    <div className="mt-6">
                        <PollBarChart votes={voteResult} options={options} bigFont={bigFont} />
                    </div>
                </div>
            </div>
        </div>
    )
};