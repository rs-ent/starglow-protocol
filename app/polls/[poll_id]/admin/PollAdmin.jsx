// /components/PollAdmin/PollAdmin.js
"use client";

import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/PollData";
import Poll from "../[locale]/Poll";
import LocaleFile from "../[locale]/LocaleFile";
import PollCardResult from "../../result/PollCard.Result";

// 하위 컴포넌트들 import
import AdminRemotePanel from "./AdminRemotePanel";
import AnnouncementPanel from "./AnnouncementPanel";
import ResultRemotePanel from "./ResultRemotePanel";
import ImagePopup from "./ImagePopup";
import UploadXPopup from "./UploadXPopup";

const ADMIN_PASSWORD = "레드슬리퍼스01!";

// 유틸리티 함수
function parseAsKST(dateStrWithoutTZ) {
  return new Date(dateStrWithoutTZ.replace(" ", "T") + ":00+09:00");
}

function toLocalInputString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function PollAdmin({ poll, poll_id, result }) {
  // 항상 호출되는 훅을 위해 validPoll 변수 사용
  const validPoll = poll && poll.title;

  // 기본 날짜/시간 값 (poll 값이 없을 경우 기본값 사용)
  const defaultTodayDate = validPoll
    ? new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
    : new Date();
  const defaultStartDate = validPoll ? parseAsKST(poll.start) : new Date();
  const defaultEndDate = validPoll ? parseAsKST(poll.end) : new Date();

  // 관리자 설정 상태 (훅은 항상 호출됨)
  const [adminToday, setAdminToday] = useState(
    toLocalInputString(defaultTodayDate)
  );
  const [adminStart, setAdminStart] = useState(
    toLocalInputString(defaultStartDate)
  );
  const [adminEnd, setAdminEnd] = useState(toLocalInputString(defaultEndDate));
  const [adminVoted, setAdminVoted] = useState(false);

  // 원격 제어 패널에서 편집하는 임시 상태
  const [tempToday, setTempToday] = useState(
    toLocalInputString(defaultTodayDate)
  );
  const [tempStart, setTempStart] = useState(
    toLocalInputString(defaultStartDate)
  );
  const [tempEnd, setTempEnd] = useState(toLocalInputString(defaultEndDate));
  const [tempLocale, setTempLocale] = useState("en");
  const [tempVoted, setTempVoted] = useState(false);

  // 인증 폼 관련 상태
  const [tempPassword, setTempPassword] = useState("");
  const [passwordTry, setPasswordTry] = useState(0);
  const [blockPassword, setBlockPassword] = useState(false);

  // UI 토글 상태
  const [showRemote, setShowRemote] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showResultRemote, setShowResultRemote] = useState(false);
  const [showXUploadPopup, setShowXUploadPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);

  // 결과 이미지 및 Announcement 관련 상태
  const [localResultImg, setLocalResultImg] = useState(
    poll?.result_img || null
  );
  const [imageLoading, setImageLoading] = useState(false);

  // Announcement / Upload 관련 상태
  const defaultHour = 17;
  const defaultMinute = 10;
  const now = new Date();
  now.setHours(defaultHour, defaultMinute, 0, 0);
  const defaultScheduledTime = toLocalInputString(now);
  const [scheduledTime, setScheduledTime] = useState(defaultScheduledTime);
  const [announceText, setAnnounceText] = useState(poll?.announce_result || "");

  const [locale, setLocale] = useState("en");
  const [t, setT] = useState(null);
  const [auth, setAuth] = useState(false);
  const [viewMode, setViewMode] = useState("poll");

  useEffect(() => {
    const storedExpires = localStorage.getItem("adminAuthExpires");
    if (storedExpires && Date.now() < parseInt(storedExpires, 10)) {
      setAuth(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const localeFile = await LocaleFile(locale);
      setT(localeFile);
    })();
  }, [locale]);

  // 이제 모든 훅이 호출된 후에 poll 유효 여부에 따라 렌더링
  if (!poll_id || !validPoll) {
    return <div>Check ID</div>;
  }

  if (!t) {
    return <div>Loading...</div>;
  }

  // --- 핸들러들 ---
  const handlePassword = () => {
    if (tempPassword === ADMIN_PASSWORD) {
      setPasswordTry(0);
      setBlockPassword(false);
      setAuth(true);
      localStorage.setItem(
        "adminAuthExpires",
        String(Date.now() + 24 * 60 * 60 * 1000)
      );
    } else {
      const newTry = passwordTry + 1;
      setPasswordTry(newTry);
      if (newTry >= 3) setBlockPassword(true);
    }
  };

  const handleApplySettings = () => {
    setAdminToday(tempToday);
    setAdminStart(tempStart);
    setAdminEnd(tempEnd);
    setLocale(tempLocale);
    setAdminVoted(tempVoted);
  };

  const handleCloseImagePopup = () => setShowImagePopup(false);

  const handleResetResultImage = () => {
    setLocalResultImg(null);
    alert("결과 이미지 초기화!");
  };

  const handleGetResultImage = async () => {
    try {
      setImageLoading(true);
      if (localResultImg) {
        setShowImagePopup(true);
        return;
      }
      const response = await fetch(`/api/get-put-result-img?pollId=${poll_id}`);
      if (!response.ok) {
        const data = await response.json();
        alert(`이미지 생성 오류: ${data?.error || response.statusText}`);
        return;
      }
      const data = await response.json();
      if (!data.success) {
        alert(`이미지 생성 오류: ${data?.error || "Unknown"}`);
        return;
      }
      setLocalResultImg(data.finalURL);
      setShowImagePopup(true);
      setAnnounceText(data.announcementText);
    } catch (err) {
      console.error("handleGetResultImage error:", err);
      alert("이미지 생성 도중 오류가 발생했습니다!");
    } finally {
      setImageLoading(false);
    }
  };

  const uploadToX = async () => {
    if (!poll.announce_result) {
      const openSheet = window.confirm(
        "Announcement 문구가 없습니다.\n구글 시트를 열까요?"
      );
      if (openSheet) {
        window.open(
          "https://docs.google.com/spreadsheets/d/1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4/edit?gid=0#gid=0",
          "_blank"
        );
      }
      return;
    }
    if (!poll.result_img && !localResultImg) {
      alert(
        "결과 발표 이미지가 없습니다.\n'Get Result Image' 버튼을 먼저 실행해주세요."
      );
      return;
    }
    setAnnounceText(poll.announce_result);
    setScheduledTime(defaultScheduledTime);
    setShowXUploadPopup(true);
  };

  const handleConfirmUploadX = async () => {
    const sure = window.confirm(`
      정말 업로드할까요?
      예약 시간: ${scheduledTime.toLocaleString().replace("T", " ")}
      문구: ${announceText}
    `);
    if (!sure) return;
    try {
      const dateObj = new Date(scheduledTime);
      if (dateObj <= new Date()) {
        const res = await fetch("/api/tweet-immediate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: announceText,
            imageUrl: poll.result_img || localResultImg,
            scheduledAt: toLocalInputString(new Date()).replace("T", " "),
            poll_id: poll.poll_id,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "즉시 업로드 실패");
        alert("과거 시각이므로 즉시 업로드합니다!");
        setShowXUploadPopup(false);
        return;
      }
      const res = await fetch("/api/tweet-scheduled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: announceText,
          imageUrl: poll.result_img || localResultImg,
          scheduledAt: scheduledTime,
          poll_id: poll.poll_id,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "예약 업로드 실패");
      alert(
        `업로드가 ${scheduledTime}에 예약되었습니다! (ID: ${
          data.schedule_id || "??"
        })`
      );
      setShowXUploadPopup(false);
    } catch (err) {
      console.error("handleConfirmUploadX error:", err);
      alert("업로드 중 오류 발생: " + err.message);
    }
  };

  // --- 렌더링 ---
  if (auth) {
    return (
      <div className="relative bg-black">
        {/* 고정 Header 버튼들 */}
        <div className="fixed top-4 left-4">
          <button
            onClick={() => setShowAnnouncement(!showAnnouncement)}
            className="bg-purple-600 text-white px-3 py-2 rounded-full"
          >
            Announcement
          </button>
        </div>
        <div className="fixed top-4 right-4">
          <button
            onClick={() => setShowRemote(!showRemote)}
            className="bg-blue-600 text-white px-3 py-2 rounded-full"
          >
            Admin Controller
          </button>
        </div>
        {viewMode === "img" && (
          <div className="fixed bottom-4 left-4 z-10">
            <button
              onClick={() => setShowResultRemote(!showResultRemote)}
              className="bg-green-600 text-white px-3 py-2 rounded-full"
            >
              Result Page Function
            </button>
          </div>
        )}

        {/* 패널들 */}
        {showRemote && (
          <AdminRemotePanel
            viewMode={viewMode}
            onShowPoll={() => setViewMode("poll")}
            onShowImg={() => setViewMode("img")}
            tempToday={tempToday}
            setTempToday={setTempToday}
            tempStart={tempStart}
            setTempStart={setTempStart}
            tempEnd={tempEnd}
            setTempEnd={setTempEnd}
            tempLocale={tempLocale}
            setTempLocale={setTempLocale}
            tempVoted={tempVoted}
            setTempVoted={setTempVoted}
            onApply={handleApplySettings}
            onClose={() => setShowRemote(false)}
          />
        )}
        {showResultRemote && (
          <ResultRemotePanel
            imageLoading={imageLoading}
            onGetResultImage={handleGetResultImage}
            onResetResultImage={handleResetResultImage}
            onUploadToX={uploadToX}
          />
        )}
        {showAnnouncement && <AnnouncementPanel pollData={poll} />}
        {showImagePopup && localResultImg && (
          <ImagePopup
            imageSrc={localResultImg}
            onClose={handleCloseImagePopup}
          />
        )}
        {showXUploadPopup && (
          <UploadXPopup
            announceText={announceText}
            setAnnounceText={setAnnounceText}
            scheduledTime={scheduledTime}
            setScheduledTime={setScheduledTime}
            onClose={() => setShowXUploadPopup(false)}
            onConfirmUpload={handleConfirmUploadX}
            imageSrc={poll.result_img || localResultImg}
          />
        )}

        {/* 메인 콘텐츠 */}
        {viewMode === "poll" ? (
          <main className="flex-grow max-w-[480px] mx-auto min-h-dvh overflow-x-hidden bg-[url('/poll-bg.png')] bg-top bg-no-repeat bg-fixed bg-black bg-blend-multiply bg-opacity-15 shadow-xl">
            <Poll
              poll={poll}
              poll_id={poll_id}
              t={t}
              overrideToday={adminToday}
              overrideStart={adminStart}
              overrideEnd={adminEnd}
              overrideVoted={adminVoted}
              preview={true}
            />
          </main>
        ) : (
          <div className="bg-[url('/poll-result-bg.png')] bg-cover w-dvw h-dvh">
            <div className="flex items-center justify-center min-h-screen">
              <div className="scale-[0.65] absolute">
                <PollCardResult poll_id={poll_id} result={result} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 미인증 상태: 패스워드 입력 폼
  return (
    <div className="w-dvw h-dvh bg-black flex items-center justify-center">
      {!blockPassword && (
        <div className="w-1/3 grid grid-cols-1 gap-2">
          <input
            type="text"
            onChange={(e) => setTempPassword(e.target.value)}
            className="border px-2 py-1 bg-transparent"
            placeholder="Enter Admin Password"
          />
          <button
            onClick={handlePassword}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Limitation: {3 - passwordTry}
          </button>
        </div>
      )}
    </div>
  );
}
