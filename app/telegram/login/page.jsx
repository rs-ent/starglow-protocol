"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export default function TelegramLoginPage() {
  // 글로벌 함수로 onTelegramAuth를 설정합니다.
  useEffect(() => {
    window.onTelegramAuth = (user) => {
      alert(
        'Logged in as ' +
          user.first_name +
          ' ' +
          user.last_name +
          ' (' +
          user.id +
          (user.username ? ', @' + user.username : '') +
          ')'
      );
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Telegram Login</h1>
      <p className="mb-8">Please login with your Telegram account to continue.</p>
      <Script
        id="telegram-login-script"
        strategy="afterInteractive"
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="starglow_redslippers_bot"
        data-size="medium"
        data-userpic="false"
        data-request-access="write"
        data-onauth="onTelegramAuth(user)"
      />
    </div>
  );
}