/// app\user\[userId]\UserHeader.jsx

"use client";

import { fetchPoints } from "../../scripts/meme-quest-points";

export default function UserHeader({ userData = {}, owner = false }) {
  console.log("User Data: ", userData);
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
        {!owner && (<button className="expand-button p-2">Follow</button>)}
      </div>
    </header>
  );
}
