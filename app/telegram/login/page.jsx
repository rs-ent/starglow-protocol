"use client";

import React, { useEffect, useRef } from "react";

export default function TelegramLoginPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    // 글로벌 콜백을 먼저 정의합니다.
    window.onTelegramAuth = (user) => {
      alert(
        `Logged in as ${user.first_name} ${user.last_name} (${user.id}${
          user.username ? ", @" + user.username : ""
        })`
      );
    };

    // 스크립트 태그를 동적으로 생성하여 container에 추가합니다.
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "starglow_redslippers_bot");
    script.setAttribute("data-size", "medium");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.async = true;
    containerRef.current.appendChild(script);

    // 컴포넌트 unmount 시 스크립트 제거 (선택사항)
    return () => {
      containerRef.current.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Telegram Login</h1>
      <p className="mb-8">Please login with your Telegram account to continue.</p>
      {/* 스크립트가 삽입될 위치 */}
      <div ref={containerRef} />
    </div>
  );
}
