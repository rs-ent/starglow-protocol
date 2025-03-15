/// app\user\[userId]\UserHeader.jsx

"use client";

import { use, useEffect, useState } from "react";
import { fetchPoints } from "../../scripts/meme-quest-points";

export default function UserHeader({ userData = {}, owner = false }) {

  const [points, setPoints] = useState(0);
  useEffect(() => {
    const fetchUserPoints = async () => {
      if(userData.telegram?.telegram_id) {
        const userPoints = await fetchPoints({ telegramId: userData.telegram.telegram_id });
        setPoints(userPoints);
      } else {
        setPoints(0);
      }
    };
    fetchUserPoints();
  }, [userData]);

  return (
    <header className="w-full h-[150px] bg-[var(--background-second)] py-6 px-4 flex items-center justify-between border-b border-[var(--border-mid)]">
      <div className="flex items-center gap-4">
        {/* 프로필 이미지 */}
        <img
          src={userData.picture || '/default-avatar.jpg'}
          alt="Profile"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold text-gradient">{userData.name}</h1>
          <p className="text-[var(--foreground-muted)]">
            {userData.suiAddress}
          </p>
        </div>
      </div>
      <div>
        {!owner ?
          (
            <button className="expand-button p-2">Follow</button>
          ) : (
            <div className="bg-gradient-to-br from-[rgba(255,255,255,0.8)] to-[rgba(0,0,0,0.8)] p-[1px] rounded-full">
              <div className="bg-[rgba(50,50,50,0.95)] px-3 py-2 rounded-full">
                <h1 className="text-[rgba(255,255,255,0.9)] text-base text-center text-gradient">{points.toLocaleString()} Points</h1>
              </div>
            </div>
          )}
      </div>

    </header>
  );
}
