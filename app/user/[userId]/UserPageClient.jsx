"use client";

import { useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";
import UserContent from "./UserContent";

export default function UserPageClient({ userData = {}, owner = false }) {
  const [content, setContent] = useState('profile');

  return (
    <div className="bg-[url('/poll-bg.png')] bg-top bg-no-repeat bg-fixed bg-cover">
      <div className="min-h-screen w-full text-[var(--foreground)] bg-[rgba(0,0,0,0.8)] bg-blend-overlay">
        <div className="justify-center">
          <UserHeader userData={userData} owner={owner} />
          <div className="flex mx-auto">
            <UserSidebar
              userData={userData}
              owner={owner}
              onSectionClick={(contentType) => setContent(contentType)}
            />
            <UserContent
              contentType={content}
              userData={userData}
              owner={owner}
            />
          </div>
        </div>
      </div>
    </div>
  );
}