"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Footer from "../components/Footer";
import TelegramLoginButton from "../telegram/login/TelegramLoginButton";

// Header를 클라이언트 사이드에서 동적으로 로딩합니다.
const Header = dynamic(() => import("../components/Header"), { ssr: false });

export default function Store() {
  // 티켓 수량 상태
  const [ticketCount, setTicketCount] = useState(1);
  // Telegram 로그인 후 사용자 정보를 저장할 상태
  const [telegramUser, setTelegramUser] = useState(null);

  // 구매 버튼 클릭 시 호출되는 함수
  const handlePurchase = async () => {
    if (!telegramUser || !telegramUser.username) {
      alert("구매를 진행하려면 먼저 Telegram 로그인을 해주세요.");
      return;
    }

    // 예시로 ticketCount 값을 포인트로 사용 (원하는 방식으로 계산)
    const points = ticketCount;

    try {
      const res = await fetch("/api/meme-quest-point-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: telegramUser.username,
          points,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Purchase successful: " + JSON.stringify(data));
      } else {
        alert("Purchase failed: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing your request.");
    }
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
        <div className="container mx-auto px-6 py-12 justify-center">
          <h1 className="text-4xl font-bold text-center mb-10 mt-20">Store</h1>
          <div className="my-4 flex justify-center items-center p-4 text-center text-white text-sm">
            {/* Telegram 로그인 */}
            <TelegramLoginButton onTelegramAuth={setTelegramUser} />
          </div>
          <div className="flex flex-col items-center">
            {/* 이미지 노출 */}
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
              <h2 className="text-3xl font-semibold mb-6 text-center">
                Voting Ticket
              </h2>
              <p className="mb-6 text-center">
                Purchase your Voting Ticket to participate in exclusive variety
                polls!
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
            </div>
          </div>
        </div>
      </div>
      <Footer device="desktop" />
    </>
  );
}