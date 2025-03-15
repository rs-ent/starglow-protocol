/// app\user\[userId]\UserSidebar.jsx

"use client";

import { useRouter } from "next/navigation";

export default function UserSidebar({ userData = {}, owner = false, onSectionClick }) {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch("/api/session-storage/user/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    sessionStorage.clear();
    router.push('/');
  }

  return (
    <nav className="w-48 bg-[var(--background-muted)] border-r border-[var(--border-mid)] min-h-[calc(100vh-70px)] p-4">
      <ul className="fixed w-40 space-y-4">
        <li>
          <a
            onClick={() => onSectionClick('profile')}
            role="button"
            className="block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Profile
          </a>
        </li>
        <li>
          <a
            onClick={() => onSectionClick('integration')}
            role="button"
            className="block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Integration
          </a>
        </li>
        <li>
          <a
            onClick={() => onSectionClick('settings')}
            role="button"
            className="block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Settings
          </a>
        </li>
        <li>
          <a
            onClick={() => onSectionClick('activity')}
            role="button"
            className="block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Activity
          </a>
        </li>
        <li>
          <a
            onClick={() => handleLogout()}
            role="button"
            className="block px-3 py-2 text-[rgba(255,50,50,1)] rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}
