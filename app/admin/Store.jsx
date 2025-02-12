"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Footer from "../components/Footer";
import TelegramLoginButton from "../telegram/login/TelegramLoginButton";
import { fetchPoints, changePoints } from "../scripts/meme-quest-points";

// Header를 클라이언트 사이드에서 동적으로 로딩합니다.
const Header = dynamic(() => import("../components/Header"), { ssr: false });

export default function Store() {
  const { data: session } = useSession();
  const [telegramUser, setTelegramUser] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [tester, setTester] = useState(0);
  const [testerId, setTesterId] = useState('7582540534');
  const votingTicketPrice = 100;

  useEffect(() => {
    // session이 존재하고 telegramUser 값이 있을 경우에만 파싱합니다.
    if (session?.user) {
      try {
        console.log("Telegram user:", session.user);
        setTelegramUser(session.user);
      } catch (error) {
        console.error("Failed to parse telegramUser:", error);
        setTelegramUser(null);
      }
    } else {
      setTelegramUser(null);
    }
  }, [session]);

  const handlePurchase = async () => {
    console.log("telegramUser:", telegramUser);
    if (!telegramUser || !telegramUser.username) {
      alert("구매를 진행하려면 먼저 Telegram 로그인을 해주세요.");
      return;
    }

    const telegramId = telegramUser.id + '';
    const addPoints = -votingTicketPrice * ticketCount;
    const data = await changePoints({
      telegramId: telegramId,
      additionalPoints: addPoints
    });
    console.log("changePoints response:", data);
  };

  const handleTester = async () => {
    const data = await changePoints({
      telegramId: testerId,
      additionalPoints: tester
    });
    console.log('testerId:', testerId);
    console.log('tester:', tester);
    console.log("changePoints response:", data);
  }

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
            <TelegramLoginButton />
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
                Voting Ticket ({votingTicketPrice}P)
              </h2>
              <p className="mb-6 text-center">
                Purchase your Voting Ticket to participate in K-POP POLLS!
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

            <div className="bg-gray-900 bg-opacity-75 p-8 rounded shadow-lg w-full md:w-1/2 mt-20">
              <div className="flex items-center justify-between mb-6">
                <div>
                <label htmlFor="ticketCount" className="mr-3 text-lg font-main">
                  Telegram ID:
                </label>
                <input
                  type="string"
                  id="testerId"
                  name="testerId"
                  value={testerId}
                  onChange={(e) => setTesterId(Number(e.target.value))}
                  className="w-36 border border-gray-300 rounded p-2 text-center text-black"
                />
                </div>
                <div>
                <label htmlFor="ticketCount" className="mr-3 text-lg font-main">
                  Additional Points:
                </label>
                <input
                  type="number"
                  id="tester"
                  name="tester"
                  value={tester}
                  onChange={(e) => setTester(Number(e.target.value))}
                  className="w-32 border border-gray-300 rounded p-2 text-center text-black"
                />
                </div>
              </div>
              <button
                onClick={handleTester}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded font-main"
              >
                Change Points
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer device="desktop" />
    </>
  );
}