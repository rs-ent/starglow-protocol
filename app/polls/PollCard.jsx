"use client";

import Image from "next/image";
import PollBarChart from "./PollBarChart";

export function formatDate(str) {
    const [datePart] = str.split(" ");
    const [yyyy, mm, dd] = datePart.split("-");
    const yy = yyyy.slice(-2);
    return `${mm}/${dd}/${yy}`;
}

export default function PollCard({poll, result}) {
    const options = poll.options.split(';');

    return (
        <div className="max-w-[440px]">
            <div className="flex flex-col p-4
                            border border-[rgba(255,255,255,0.4)] rounded-3xl
                            bg-gradient-to-t from-[rgba(0,0,0,0.9)] via-[rgba(0,0,0,0.3)] to-[rgba(0,0,0,0)]
                            glow-12
                            ">
                {poll.img && (
                    <div className="bg-gradient-to-br from-[rgba(255,255,255,0.8)] to-[rgba(255,255,255,0.1)] rounded-3xl p-[1px] shadow-sm">
                        <div className="bg-black rounded-3xl">
                            <div className="flex justify-center">
                                <Image
                                    src={poll.img}
                                    alt={poll.title}
                                    width={500}
                                    height={300}
                                    unoptimized
                                    className="rounded-3xl shadow-md w-full"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl mt-3">
                    #{poll.poll_id.replace('p','')}
                </h1>
            
                <h1 className="text-xl">
                    {poll.title}
                </h1>

                <p className="text-xs text-[rgba(255,255,255,0.6)]">
                    {formatDate(poll.start)}~{formatDate(poll.end)}
                </p>

                <div className="mt-6">
                    <PollBarChart votes={result.votes} options={options}/>
                </div>
            </div>
        </div>
    )
};