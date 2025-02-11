// app/telegram/login/TelegramLoginButton.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import TelegramLogoutButton from "./TelegramLogoutButton";

export default function TelegramLoginButton({ onTelegramAuth }) {
  const containerRef = useRef(null);
  const [telegramUser, setTelegramUser] = useState(null);
  const [popupOpened, setPopupOpened] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      setTelegramUser(null);
    }
  }, [session]);

  const handleTelegramAuth = (user) => {
    console.log("Telegram user:", user);
    setTelegramUser(user);

    if (onTelegramAuth) {
      onTelegramAuth(user);
    }

    // NextAuth의 Credentials Provider를 통해 로그인 시도
    signIn("credentials", { telegramUser: JSON.stringify(user) }, { redirect: false });
  };

  useEffect(() => {
    window.handleTelegramAuth = handleTelegramAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "starglow_redslippers_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "handleTelegramAuth(user)");
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current && containerRef.current.contains(script)) {
        containerRef.current.removeChild(script);
      }
      delete window.handleTelegramAuth;
    };
  }, []);

  const handlePopup = () => {
    setPopupOpened((prev) => !prev);
  };

  return telegramUser ? (
    <div>
      <button 
        className="bg-[#54a9eb] text-base rounded-full text-white py-2 px-4"
        onClick={handlePopup}
      >
        {telegramUser.username}
      </button>

      {popupOpened && (
        <div className="fixed flex items-center justify-center" onClick={() => setPopupOpened(false)}>
          <div className="bg-[rgba(255,255,255,0.3)] mt-2 rounded-lg backdrop-blur-md shadow-md" onClick={(e) => e.stopPropagation()}>
            <TelegramLogoutButton />
          </div>
        </div>
      )}
    </div>
  ) : (
    <div ref={containerRef} />
  );
}
// app/api/auth/%5B...nextauth%5D/route.js