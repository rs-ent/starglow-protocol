"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Footer from "../components/Footer";
import Script from "next/script";

// Header를 클라이언트 사이드에서 동적으로 로딩합니다.
const Header = dynamic(() => import("../components/Header"), { ssr: false });

export default function Store() {
  const [ticketCount, setTicketCount] = useState(1);
  const [showTelegramLogin, setShowTelegramLogin] = useState(false);

  // Telegram 로그인 콜백 설정
  useEffect(() => {
    window.onTelegramAuth = (user) => {
      console.log("Telegram auth response:", user);
      // Telegram 로그인 후 username을 추출합니다.
      const username = user.username;
      alert(
        `Welcome ${username}! Purchased ${ticketCount} Voting Ticket${
          ticketCount > 1 ? "s" : ""
        }!`
      );
      // 이후 서버로 username을 전송하거나 추가 로직을 진행할 수 있습니다.
      setShowTelegramLogin(false);
    };
  }, [ticketCount]);

  const handlePurchase = () => {
    // Purchase Now 버튼을 누르면 Telegram 로그인 위젯을 표시합니다.
    setShowTelegramLogin(true);
  };

  return (
    <>
      <Header />
      <div
        className="
          bg-[url('/poll-bg-dt.png')] bg-top bg-no-repeat bg-fixed
          bg-black bg-blend-multiply bg-opacity-15
          items-center justify-center pb-64
        "
      >
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-center mb-10 mt-20">Store</h1>
          <div className="flex flex-col items-center">
            {/* [public/voting.png] 이미지 노출 */}
            <div className="mb-10">
              <Image
                src="/voting.png"
                alt="Voting Ticket"
                width={600}
                height={400}
                className="rounded shadow-lg"
              />
            </div>

            {/* Voting Ticket 구매 섹션 */}
            <div className="bg-gray-900 bg-opacity-75 p-8 rounded shadow-lg w-full md:w-1/2">
              <h2 className="text-3xl font-semibold mb-6 text-center">Voting Ticket</h2>
              <p className="mb-6 text-center">
                Purchase your Voting Ticket to participate in exclusive variety polls!
              </p>
              <div className="flex items-center justify-center mb-6">
                <label htmlFor="ticketCount" className="mr-3 text-lg font-main">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="ticketCount"
                  name="ticketCount"
                  min="1"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="w-20 border border-gray-300 rounded p-2 text-center text-black"
                />
              </div>
              <button
                onClick={handlePurchase}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded font-main"
              >
                Purchase Now
              </button>
              {showTelegramLogin && (
                <div className="mt-6">
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
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer device="desktop" />
    </>
  );
}