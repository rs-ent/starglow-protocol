"use client";

import { useState } from "react";
import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";
import UserContent from "./UserContent";

export default function UserPageClient({ userData, owner }) {
  const [content, setContent] = useState('profile');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="container mx-auto w-[55%] p-20">
        <UserHeader userData={userData} owner={owner} />
        <div className="flex">
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
  );
}