'use client';

import React, { useState } from 'react';
import { useInterval } from 'react-use';

function Countdown({ endDate, onTick }) {
    const [timeLeft, setTimeLeft] = useState("00:00:00");

    useInterval(() => {
        const today = new Date(
          new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
        );
        let diffSec = Math.floor((endDate - today) / 1000);
    
        // 이미 종료 시간이 지난 경우 0초 처리
        if (diffSec < 0) diffSec = 0;
    
        // 시, 분, 초 계산
        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;
    
        // 2자리 포맷 (00:00:00)
        const hh = String(hours).padStart(2, "0");
        const mm = String(minutes).padStart(2, "0");
        const ss = String(seconds).padStart(2, "0");

        if (onTick) {
          onTick(diffSec);
        }
    
        // 최종 결과를 문자열로 저장
        setTimeLeft(`${hh}:${mm}:${ss}`);
    }, 1000);

    return <div>{timeLeft}</div>;
}

export default Countdown;