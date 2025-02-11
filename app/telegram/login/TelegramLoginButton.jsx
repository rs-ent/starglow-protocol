"use client";

import React, { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import TelegramLogoutButton from "./TelegramLogoutButton";

export default function TelegramLoginButton() {
  const containerRef = useRef(null);
  const { data: session } = useSession();
  const [popupOpened, setPopupOpened] = useState(false);

  // Telegram 로그인 성공 시 호출되는 콜백 함수
  const onTelegramAuth = (user) => {
    console.log("Telegram user:", user);
    // NextAuth Credentials Provider를 통해 로그인 시도 (리다이렉트 없이)
    signIn("credentials", {
      telegramUser: JSON.stringify(user),
      redirect: false,
    });
  };

  useEffect(() => {
    // 만약 이미 로그인한 상태라면 텔레그램 위젯 스크립트를 로드하지 않음
    if (session?.user) return;

    // 전역에 콜백 함수 등록
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
  }, [session]);

  const handlePopup = () => {
    setPopupOpened((prev) => !prev);
  };

  // 로그인 상태라면 로그인 완료 박스 렌더링
  if (session?.user) {
    return (
      <div className="login-completed-box">
        <button 
          className="bg-[#54a9eb] text-base rounded-full text-white py-2 px-4"
          onClick={handlePopup}
        >
          {session.user.username}
        </button>
        {popupOpened && (
          <div
            className="fixed flex items-center justify-center"
            onClick={() => setPopupOpened(false)}
          >
            <div
              className="bg-[rgba(255,255,255,0.3)] mt-2 rounded-lg backdrop-blur-md shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <TelegramLogoutButton />
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div ref={containerRef} />;
}