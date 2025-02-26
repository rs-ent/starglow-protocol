"use client";

import React, { useState } from "react";
import PollBarChart from "./PollBarChart";
import Comments from "./Comments";

export function formatDate(str) {
  const [datePart] = str.split(" ");
  const [yyyy, mm, dd] = datePart.split("-");
  const yy = yyyy.slice(-2);
  return `${mm}/${dd}/${yy}`;
}

export default function PollCard({ poll, result, enableComments = true }) {
  const [showComments, setShowComments] = useState(false);
  const options = poll.options.split(";");
  let voteResult = {};
  options.forEach((option, idx) => {
    voteResult[idx] = 0;
  });
  if (result && result.votes) voteResult = result.votes;

  return (
    <div className="relative max-w-[440px] min-w-[220px]">
      <div
        className="flex flex-col p-4
          border border-[rgba(255,255,255,0.4)] rounded-3xl
          bg-gradient-to-t from-[rgba(0,0,0,0.9)] via-[rgba(0,0,0,0.3)] to-[rgba(0,0,0,0)]
          "
      >
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
        <h1 className="text-2xl mt-3">#{poll.poll_id.replace("p", "")}</h1>
        <h1 className="text-xl">{poll.title}</h1>
        <p className="text-xs text-[rgba(255,255,255,0.6)]">
          {formatDate(poll.start)}~{formatDate(poll.end)}
        </p>
        <div className="mt-6">
          <PollBarChart
            votes={voteResult}
            options={options}
            start={poll.start}
            end={poll.end}
          />
        </div>
        {enableComments && (
          <div
            className="text-center font-main text-[0.7rem] text-gradient cursor-pointer mt-4 hover:text-[0.75rem] transition-all duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
          >
            leave comments
          </div>
        )}
      </div>

      {showComments && (
        <div className="absolute inset-0 z-20 bg-black bg-opacity-80 flex flex-col rounded-3xl">
          <Comments
            poll={poll}
            needCloseButton={true}
            onCloseComments={() => setShowComments(false)}
          />
        </div>
      )}
    </div>
  );
}
