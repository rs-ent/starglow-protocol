/// app\user\[userId]\UserSidebar.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../scripts/user";

export default function UserSidebar({ userData = {}, owner = false, onSectionClick }) {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handleSelect = (section) => {
    setContent(section);
    console.log("section", section);
    onSectionClick(section);
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res){
      router.push('/');
    }
  }

  const sectionList = [
    {
      name: "Profile",
      key: "profile",
      onClick: () => handleSelect('profile'),
      className: "text-[rgba(255,255,255,0.9)]",
    },
    {
      name: "Integration",
      key: "integration",
      onClick: () => handleSelect('integration'),
      className: "text-[rgba(255,255,255,0.9)]",
    },
    {
      name: "Settings",
      key: "settings",
      onClick: () => handleSelect('settings'),
      className: "text-[rgba(255,255,255,0.9)]",
    },
    {
      name: "Activity",
      key: "activity",
      onClick: () => handleSelect('activity'),
      className: "text-[rgba(255,255,255,0.9)]",
    },
    {
      name: "Logout",
      key: "logout",
      onClick: handleLogout,
      className: "text-[rgba(255,50,50,1)]",
    },
  ];

  return (
    <aside className="flex flex-col w-[20%] border-r border-[rgba(255,255,255,0.1)]">
      {sectionList.map((section, index) => (
        <button
          key={section.key}
          onClick={section.onClick}
          className={`test-sm hover:bg-[rgba(255,255,255,0.2)] px-2 py-6 border-b border-b-[rgba(255,255,255,0.1)] transition-all duration-150 
                      ${section.className ? section.className : ""}
                      ${content === section.key ? "bg-[rgba(255,255,255,0.2)]" : ""}
                    `}
        >
          {section.name}
        </button>
      ))}
    </aside>
  );
}
