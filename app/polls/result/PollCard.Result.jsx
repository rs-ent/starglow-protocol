"use client";

import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/PollData";
import Measure from "react-measure";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    LabelList
} from "recharts";

function buildVoteData(votes, optionsArray) {
    if (!optionsArray) return [];
    return optionsArray.map((label, idx) => {
        const count = votes[idx] || 0;
        return {
            name: label,
            count,
        };
    });
}

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

    const data = buildVoteData(voteResult, options);

    const totalVotes = data.reduce((sum, item) => sum + item.count, 0) || 1; 
    const dataWithPercent = data.map((item) => ({
        name: item.name || '',
        value: (item.count / totalVotes) * 100 || 0,
    })).sort((a,b) => b.value - a.value);

    const [bounds, setBounds] = useState({ width: 0, height: 0 });
    const [fontSize, setFontSize] = useState(20);

    useEffect(() => {
        if (bounds.width) {
          const newFontSize = Math.max(50, Math.min(bounds.width / 10, 110));
          setFontSize(newFontSize);
        }
    }, [bounds]);

    return (
        <div className="poll-card-result-wrapper">
            <div className="text-center">
                <h2 className="text-6xl text-gradient ">
                    #{pollNumber} POLL RESULT
                </h2>
                <div className="mb-5 w-[1300px] h-[280px] flex justify-center mx-auto">
                <Measure
                    bounds
                    onResize={(contentRect) => {
                    setBounds(contentRect.bounds);
                    }}
                >
                    {({ measureRef }) => (
                    <div 
                        ref={measureRef} 
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1.1,
                        }}
                    >
                        <h1 className="text-[rgba(146,92,218,1)] text-shadow-strong text-center" style={{ fontSize }}>
                            {winner}
                        </h1>
                    </div>
                    )}
                </Measure>
                </div>
            </div>
            <div className="relative flex justify-center w-dvw"> 
                <div className="grid grid-cols-[45%_55%] gap-9 justify-center items-center px-[4vw] mx-auto">
                    <div className="relative">
                        <img
                                src="/sgt-logo-glow.png"
                                width={80}
                                height={80}
                                className="
                                    absolute
                                    top-[-38px] left-[43%]
                                    z-10
                                "
                        />
                        <div className="card-frame p-6
                                        border border-[rgba(255,255,255,0.4)] rounded-lg
                                        bg-gradient-to-t from-[rgba(0,0,0,1)] to-[rgba(32,32,42,1)]
                                        glow-12
                                        ">
                            {poll.img && (
                                <div className="img-container bg-gradient-to-br from-[rgba(255,255,255,0.8)] to-[rgba(255,255,255,0.1)] rounded-lg p-[1px] shadow-sm">
                                    <div className="bg-black rounded-lg">
                                        <div className="aspect-[2.0625/1] relative">
                                            <img
                                                src={poll.img}
                                                alt={poll.title}
                                                className="rounded-lg shadow-md w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <h1 className="text-[2.5rem]" style={{lineHeight: 1.1}}>
                            {poll.title}
                        </h1>

                        <p className="text-[1.0rem] text-[rgba(255,255,255,0.8)] my-1">
                            {formatDate(poll.start)}~{formatDate(poll.end)}
                        </p>

                        <div className="mt-3">
                            <div>
                                {dataWithPercent.map((item, idx) => {
                                    const computedOpacity = 1.0 - ((0.5 / (data.length - 1)) * idx);
                                    console.log(item);
                                    return(
                                        <div key={idx} className="mb-[0.4rem]" style={{ opacity: computedOpacity }}>
                                            <h1 className="text-[1.7rem] mb-[0.01rem]">
                                                {item.name}
                                            </h1>
                                            <ResponsiveContainer width="100%" height={40}>
                                                <BarChart
                                                    layout="vertical"
                                                    data={[item]}
                                                    margin={{ top: 0, right: 60, left: 0, bottom: 5 }}
                                                >
                                                    <XAxis type="number" domain={[0, 100]} hide />
                                                    <YAxis dataKey="name" type="category" hide />
                                                    <Bar
                                                        dataKey="value"
                                                        fill="rgb(132,94,238)"
                                                        radius={[8, 2, 2, 8]}
                                                    >
                                                        <LabelList
                                                            dataKey="value"
                                                            position="right"
                                                            formatter={(val) => `${Math.round(val)}%`}
                                                            style={{
                                                                fontFamily: "var(--font-heading)", 
                                                                fontSize: "1.65rem",
                                                                fill: "rgba(255,255,255,0.8)",
                                                            }}
                                                        />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};