"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Footer from "../components/Footer";
import TelegramLoginButton from "../telegram/login/TelegramLoginButton";

// Header를 클라이언트 사이드에서 동적으로 로딩합니다.
const Header = dynamic(() => import("../components/Header"), { ssr: false });

export default function Store() {
  return (
    <div className="bg-gray-400">
      test
    </div>
  )
}