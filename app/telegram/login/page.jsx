"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function TelegramLoginPage() {
  const router = useRouter();

  // Telegram 로그인 콜백 설정
  useEffect(() => {
    window.onTelegramAuth = (user) => {
      router.push("/");
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-3xl font-bold mb-4">Telegram Login</h1>
      <p className="mb-8">Please login with your Telegram account to continue.</p>
      
      {/* Telegram 로그인 위젯 스크립트 */}
      <Script
        id="telegram-login-script"
        strategy="afterInteractive"
        src="https://telegram.org/js/telegram-widget.js?15"
        data-telegram-login="starglow_redslippers_bot"
        data-size="large"
        data-userpic="false"
        data-request-access="write"
        data-callback="onTelegramAuth"
        data-lang="en"
      />
    </div>
  );
}