/// app\user\[userId]\UserSidebar.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../scripts/user/user";
import { LogOut, Blocks } from "lucide-react";

export default function UserSidebar({ userData = {}, owner = false, onSectionClick }) {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handleSelect = (section) => {
    setContent(section);
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
      name: "Integration",
      key: "integration",
      onClick: () => handleSelect('integration'),
      className: "text-[rgba(255,255,255,0.9)]",
      icon: <Blocks size={20} strokeWidth={2} />
    },
    {
      name: "Sign Out",
      key: "logout",
      onClick: handleLogout,
      className: "text-[rgba(255,50,50,1)]",
      icon: <LogOut size={20} strokeWidth={2} />
    },
  ];

  if(userData.allowMinting && owner) {
    sectionList.unshift({
      name: "Mint NFT",
      key: "mintNFT",
      onClick: () => handleSelect('nft-mint'),
      className: "text-[rgba(255,255,150,0.9)]",
      icon: <Blocks size={20} strokeWidth={2} />
    })
  }

  return (
    <aside className="flex flex-col w-[20%] border border-[rgba(255,255,255,0.1)] bg-[rgba(200,200,255,0.05)] h-screen">
      {sectionList.map((section, index) => (
        <button
          key={section.key}
          onClick={section.onClick}
          className={`flex gap-4 items-center test-sm hover:bg-[rgba(255,255,255,0.2)] pl-4 py-6 transition-all duration-150 
                      ${index < sectionList.length - 1 ? "border-b border-b-[rgba(255,255,255,0.1)]" : ""}
                      ${section.className ? section.className : ""}
                      ${content === section.key ? "bg-[rgba(255,255,255,0.2)]" : ""}
                    `}
        >
          {section.icon}
          {section.name}
        </button>
      ))}
    </aside>
  );
}
