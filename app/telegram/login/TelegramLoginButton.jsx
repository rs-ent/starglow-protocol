"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import TelegramLogoutButton from "./TelegramLogoutButton";

export default function TelegramLoginButton() {
  const containerRef = useRef(null);
  const { data: session, status } = useSession();
  const [popupOpened, setPopupOpened] = useState(false);

  const onTelegramAuth = (user) => {
    console.log("Telegram user:", user);
    signIn("credentials", {
      telegramUser: JSON.stringify(user),
      redirect: false
    });
  };

  useEffect(() => {
    if (process.env.NEXTAUTH_URL === "http://localhost:3000") {
      
    } else {
      if (session?.user) return;

      window.onTelegramAuth = onTelegramAuth;

      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", "starglow_redslippers_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-userpic", "true");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.async = true;

      if (containerRef.current) {
        containerRef.current.appendChild(script);
      }

      return () => {
        if (containerRef.current && containerRef.current.contains(script)) {
          containerRef.current.removeChild(script);
        }
        delete window.onTelegramAuth;
      };
    }
  }, []);

  const handlePopup = () => {
    setPopupOpened((prev) => !prev);
  };

  const shouldRenderWidget = !session?.user;

  return session?.user ? (
    <div className="login-completed-box">
      <button
        className="bg-[#54a9eb] text-base rounded-full text-white py-2 px-4"
        onClick={handlePopup}
      >
        <Image
          src='/ui/telegram-icon.png'
          alt='search-icon'
          width={17}
          height={17}
          className="mr-2"
        />
        {session.user.username}
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
    shouldRenderWidget && <div ref={containerRef} />
  );
}