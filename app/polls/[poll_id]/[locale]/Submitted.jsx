"use client";

import Image from "next/image";
import Countdown from "./Countdown";
import { useCallback } from "react";
import { clickAccessButton } from "../../../firebase/fetch";
import Comments from "../../Comments";

function parseAsKST(dateStrWithoutTZ) {
  return new Date(dateStrWithoutTZ.replace(" ", "T") + ":00+09:00");
}

const copyToClipboard = async (text) => {
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {
      console.warn("Async Clipboard API 실패, fallback 실행", err);
    }
  }
  // fallback: execCommand('copy')
  fallbackCopyToClipboard(text);
};

const fallbackCopyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  // 화면에 보이지 않도록 스타일링
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const successful = document.execCommand("copy");
    if (!successful) {
      console.error("Fallback 복사 실패");
    }
  } catch (err) {
    console.error("Fallback 복사 중 에러 발생", err);
  }
  document.body.removeChild(textarea);
};

export default function Submitted({ poll_id, title, options, endDate, t }) {
  const shareText =
    `🌟 STARGLOW K-POP Poll 🚀\n\n` +
    `"${title}"\n` +
    `-----------------------\n` +
    `${options.map((opt, index) => `⚪ ${opt}`).join("\n")}\n\n` +
    `What do you Think? 🤔` +
    `Tap the link and vote ryt now!`;
  const shareUrl = `https://starglow-protocol.vercel.app/polls/${poll_id}`;

  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );

  if (today > endDate) {
    return (
      <div>
        <h1 className="text-xl text-gradient">{t["poll"]["ended"]}</h1>
      </div>
    );
  }

  const handleShare = useCallback(async () => {
    try {
      // 공유 액세스 로깅: 사용자 제스처 체인을 끊지 않으려면 fire-and-forget 방식으로 호출
      handleAccessClick("toShare");

      // 링크를 클립보드에 복사 (Clipboard API 또는 fallback)
      await copyToClipboard(shareUrl);

      // Share API 사용 (지원되는 경우)
      if (navigator.share && typeof navigator.share === "function") {
        await navigator.share({
          title: "", // 필요에 따라 제목 추가
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Share API 미지원 시 사용자에게 알림
        alert(
          "The link has been copied to your clipboard! Share it with your friends!"
        );
      }
    } catch (error) {
      console.error("공유 실행 실패", error);
      alert("Sharing failed. Please try again.");
    }
  }, [poll_id, shareText, shareUrl]);

  const handleAccessClick = async (type, event) => {
    let ipData = { ip: "unknown" };
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      ipData = await res.json();
    } catch (err) {
      console.error("Failed", err);
    } finally {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        devicePixelRatio: window.devicePixelRatio,
        ipAddress: ipData.ip,
      };

      clickAccessButton(deviceInfo, type);
    }
  };

  return (
    <div className="m-4 p-2 flex flex-col min-h-screen items-center justify-center">
      <div className="relative items-center justify-center">
        <h1 className="text-center text-base text-outline-1 mt-10">
          {t["poll"]["openInX"]}
        </h1>
        <h1 className="text-center text-5xl text-outline-1">
          <Countdown endDate={endDate} />
        </h1>
        <h1 className="text-3xl whitespace-pre-wrap text-center mt-16 px-3">
          {t["poll"]["yay"]}
        </h1>
      </div>
      <button
        type="button"
        onClick={handleShare}
        className="button-base mt-16"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Image
          src="/ui/share-icon.png"
          alt="share-icon"
          width={19}
          height={19}
          className="mr-2"
        />
        {t["poll"]["shareFriend"]}
      </button>
      <a
        href="/polls"
        rel="noreferrer"
        className="button-base mt-4"
        onClick={(e) => handleAccessClick("toPollList", e)}
      >
        <Image
          src="/ui/search-icon.png"
          alt="search-icon"
          width={17}
          height={17}
          className="mr-2"
        />
        {t["poll"]["discoverMore"]}
      </a>
      <a
        href="https://x.com/StarglowP"
        target="_blank"
        rel="noreferrer"
        className="button-black mt-4 mb-16"
        onClick={(e) => handleAccessClick("toX", e)}
      >
        <Image
          src="/ui/x-icon.png"
          alt="x-icon"
          width={15}
          height={15}
          className="mr-2"
        />
        {t["poll"]["followStarglow"]}
      </a>

      <div className="mt-auto flex justify-center mb-4">
        <Image
          src="/sgt_logo.png"
          alt="STARGLOW LOGO"
          width={130}
          height={130}
        />
      </div>
    </div>
  );
}
