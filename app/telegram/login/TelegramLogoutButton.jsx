"use client";

import React from "react";
import { signOut } from "next-auth/react";

export default function TelegramLogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          // 로그아웃 후 리다이렉션 URL을 설정하려면 callbackUrl 옵션 사용 (옵션)
          // callbackUrl: "/",
          redirect: false, // 자동 리다이렉트 하지 않으려면 false로 설정
        })
      }
      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}