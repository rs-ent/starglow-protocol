/// app\user\[userId]\UserSidebar.jsx

"use client";

export default function UserSidebar({ userData = {}, owner = false }) {

  const handleClick = (section) => {
    console.log(`Navigating to ${section}`);
  }

  return (
    <nav className="w-48 bg-[var(--background-muted)] border-r border-[var(--border-mid)] min-h-[calc(100vh-70px)] p-4">
      <ul className="fixed w-40 space-y-4">
        <li>
          <a
            onClick={() => handleClick('profile')}
            role="button"
            className="block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Profile
          </a>
        </li>
        <li>
          <a
            onClick={() => handleClick('integration')}
            role="button"
            className="block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Integration
          </a>
        </li>
        <li>
          <a
            onClick={() => handleClick('settings')}
            role="button"
            className="block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Settings
          </a>
        </li>
        <li>
          <a
            onClick={() => handleClick('activity')}
            role="button"
            className="block px-3 py-2 rounded hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
          >
            Activity
          </a>
        </li>
      </ul>
    </nav>
  );
}
