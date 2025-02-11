"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import TelegramLogoutButton from "./TelegramLogoutButton";

export default function TelegramLoginButton() {
  const containerRef = useRef(null);
  const { data: session } = useSession();
  const [popupOpened, setPopupOpened] = useState(false);
  const [telegramUser, setTelegramUser] = useState(null);

  const onTelegramAuth = (user) => {
    console.log("Telegram user:", user);
    signIn("credentials", {
      telegramUser: JSON.stringify(user),
      redirect: false
    });
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BASE_URL === "http://localhost:3000") {
      const tester = {
        "id": 7582540534,
        "first_name": "Wayd",
        "last_name": "Cloud",
        "username": "waydcloud",
        "auth_date": 1739247482,
        "hash": "1ab3f507af7536161527e37425888c1cd5f45dd3a404d6814a365637f4f45672"
      };
      setTelegramUser(tester);
    } else {
      if (session?.user) {
        setTelegramUser(session.user);
        return;
      }

      window.onTelegramAuth = onTelegramAuth;

      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-login", "starglow_redslippers_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-userpic", "true");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.async = true;

      console.log(containerRef.current);

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

  useEffect(() => {
    if (session?.user) {
      setTelegramUser(JSON.parse(session.user));
    }
  }, [session]);

  const handlePopup = () => {
    setPopupOpened((prev) => !prev);
  };

  return telegramUser !== null ? (
    <div className="login-completed-box">
      <button
        className="button-telegram inline-flex items-center"
        onClick={handlePopup}
      >
        <Image
          src='/ui/telegram-icon.png'
          alt='search-icon'
          width={17}
          height={17}
          className="mr-2"
        />
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