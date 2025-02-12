"use client";

import React, { useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import TelegramLogoutButton from "./TelegramLogoutButton";

export default function TelegramLoginButton() {
  const containerRef = useRef(null);
  const scriptRef = useRef(null); // 스크립트 요소를 저장하기 위한 ref
  const { data: session } = useSession();
  const [popupOpened, setPopupOpened] = useState(false);
  const [points, setPoints] = useState(0);
  const [telegramUser, setTelegramUser] = useState(null);

  // Telegram 로그인 성공 시 호출되는 콜백 함수
  const onTelegramAuth = (user) => {
    if (user) {
      try {
        console.log("Telegram user:", user);
        signIn("credentials", {
          telegramUser: JSON.stringify(user),
          redirect: true,
        });
        setTelegramUser(user);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    } else {
      console.error("Telegram user data is undefined.");
      return;
    }
  };
  
  useEffect(() => {
    // 로그인 상태라면 이미 스크립트가 있다면 제거하고 새로 추가하지 않음.
    if (session?.user) {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }

      const fetchPoints = async () => {
        try {
          const response = await fetch(
            `/api/meme-quest-point-check?telegramId=${encodeURIComponent(
              session.user.id
            )}`
          );
          if (!response.ok) {
            throw new Error("포인트를 가져오는데 실패했습니다.");
          }
          const data = await response.json();
          console.log("meme-quest-point-check response:", data);
          setPoints(data.points || 0);
        } catch (error) {
          console.error("Error fetching points:", error);
        }
      };
      fetchPoints();

      return;
    }

    // 로그인하지 않은 상태일 때만 텔레그램 위젯 스크립트를 추가
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
      scriptRef.current = script;
    }

    // Cleanup: 스크립트와 전역 콜백 제거
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      delete window.onTelegramAuth;
    };
  }, [session]);

  const handlePopup = () => {
    setPopupOpened((prev) => !prev);
  };

  // 로그인 상태라면 로그인 완료 UI 렌더링
  if (session?.user) {
    return (
      <div className="login-completed-box">
        <button
          className="bg-[#54a9eb] text-base rounded-full text-white py-2 px-4"
          onClick={handlePopup}
        >
          {session.user.username} ({points.toLocaleString()}🅿️)
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

  // 로그인하지 않은 상태일 때는 위젯 스크립트가 붙을 컨테이너 렌더링
  return <div ref={containerRef} />;
}