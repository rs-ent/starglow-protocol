"use client";

import React from "react";
import TelegramLoginButton from "./TelegramLoginButton";

export default function TelegramLoginPage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Telegram Login</h1>
      <p className="mb-8">Please login with your Telegram account to continue.</p>
      <TelegramLoginButton />
    </div>
  );
}