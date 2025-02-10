"use client";

import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    LabelList
} from "recharts";

export default function PollBarChart({ votes, options, start, end }) {
    const data = buildVoteData(votes, options);
    const totalVotes = data.reduce((sum, item) => sum + item.count, 0) || 1;
    const sorted = [...data].sort((a, b) => b.count - a.count);
    const rankMap = new Map();
    sorted.forEach((item, index) => {
        rankMap.set(item.name, index);
    });
    const dataWithPercent = data.map((item) => {
        const value = (item.count / totalVotes) * 100 || 0;
        const rank = rankMap.get(item.name);

        return {
            name: item.name || '',
            value,
            rank,
        };
    });

    const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const endDate = parseAsKST(end);
    const endDateMinus3Days = new Date(endDate);
    endDateMinus3Days.setDate(endDate.getDate() - 3);
    const endDatePlus1Hour = new Date(endDate.getTime() + 1 * 60 * 60 * 1000);

    let isBlur = false;
    if (today > endDateMinus3Days && today < endDatePlus1Hour) {
        isBlur = true;
    }

    return (
        <PollBars data={dataWithPercent} blur={isBlur} />
    );
}

function parseAsKST(dateStrWithoutTZ) {
    return new Date(dateStrWithoutTZ.replace(" ", "T") + ":00+09:00");
}

// Make this a named export or a local function
function PollBars({ data, blur }) {

    if (blur) {
        return (
            <div>
                {data.map((item, idx) => {
                    const computedOpacity = 1.0;
                    item.value = 99;
                    return (
                        <div key={idx} className="mb-2" style={{ opacity: computedOpacity }}>
                            <h1 className="text-base mb-0.5">
                                {item.name}
                            </h1>
                            <ResponsiveContainer width="100%" height={34}>
                                <BarChart
                                    layout="vertical"
                                    data={[item]}
                                    margin={{ top: 0, right: 50, left: 0, bottom: 5 }}
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
                                            formatter={(val) => `??%`}
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                fontSize: "0.75rem",
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
        );
    } else {
        return (
            <div>
                {data.map((item, idx) => {
                    const computedOpacity = 1.0 - ((0.6 / (data.length - 1)) * item.rank);
                    return (
                        <div key={idx} className="mb-2" style={{ opacity: computedOpacity }}>
                            <h1 className="text-base mb-0.5">
                                {item.name}
                            </h1>
                            <ResponsiveContainer width="100%" height={34}>
                                <BarChart
                                    layout="vertical"
                                    data={[item]}
                                    margin={{ top: 0, right: 50, left: 0, bottom: 5 }}
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
                                                fontSize: "0.75rem",
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
        );
    }
}

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