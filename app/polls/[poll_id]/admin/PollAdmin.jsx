"use client";

import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/PollData";
import Poll from "../[locale]/Poll";
import LocaleFile from "../[locale]/LocaleFile";
import PollCardResult from "../../result/PollCard.Result";

const ADMIN_PASSWORD = "레드슬리퍼스01!";

export default function PollAdmin({poll_id, result}) {
    const [locale, setLocale] = useState('en');
    const [t, setT] = useState(null);
    const [auth, setAuth] = useState(false);

    const pollData = useContext(DataContext);
    const poll = pollData?.[poll_id];
    console.log(poll);
    if (!poll_id || !poll || !poll.title){
        return <div>Check ID</div>
    }

    const defaultTodayDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    const defaultStartDate = parseAsKST(poll.start);
    const defaultEndDate = parseAsKST(poll.end);

    const [viewMode, setViewMode] = useState("poll");
    const [adminToday, setAdminToday] = useState(toLocalInputString(defaultTodayDate));
    const [adminStart, setAdminStart] = useState(toLocalInputString(defaultStartDate));
    const [adminEnd, setAdminEnd] = useState(toLocalInputString(defaultEndDate));
    const [adminVoted, setAdminVoted] = useState(false);

    const [tempToday, setTempToday] = useState(adminToday);
    const [tempStart, setTempStart] = useState(adminStart);
    const [tempEnd, setTempEnd] = useState(adminEnd);
    const [tempLocale, setTempLocale] = useState(locale);
    const [tempVoted, setTempVoted] = useState(false);
    const [tempPassword, setTempPassword] = useState('');
    const [passwordTry, setPasswordTry] = useState(0);
    const [blockPassword, setBlockPassword] = useState(false);

    const [showRemote, setShowRemote] = useState(false);
    const [showResultRemote, setShowResultRemote] = useState(false);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const [localResultImg, setLocalResultImg] = useState(poll.result_img || null);
    const [imageLoading, setImageLoading] = useState(false);

    const [showXUploadPopup, setShowXUploadPopup] = useState(false);
    const defaultHour = 17;
    const defaultMinute = 10;
    const now = new Date();
    now.setHours(defaultHour, defaultMinute, 0, 0);
    const defaultScheduledTime = toLocalInputString(now);

    const [scheduledTime, setScheduledTime] = useState(defaultScheduledTime);
    const [announceText, setAnnounceText] = useState(poll.announce_result || "");

    useEffect(() => {
        const storedExpires = localStorage.getItem("adminAuthExpires");
        if (!storedExpires) return;
      
        const expiresNum = parseInt(storedExpires, 10);
        if (Date.now() < expiresNum) {
            setAuth(true);
        }
    }, []);

    useEffect(() => {
        (async () => {
            const localeFile = await LocaleFile(locale);
            setT(localeFile);
        })();
    }, [locale]);

    if (!t) {
        return <div>Loading...</div>;
    }

    const handlePassword = () => {
        if (tempPassword === ADMIN_PASSWORD) {
            setPasswordTry(0);
            setBlockPassword(false);
            setAuth(true);

            const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
            localStorage.setItem("adminAuthExpires", String(expiresAt));

        } else {
            const newTry = passwordTry + 1;
            setPasswordTry(newTry);
            if(newTry === 3) {
                setBlockPassword(true);
            }
        }
    }

    const handleShowPoll = () => setViewMode("poll");
    const handleShowImg = () => setViewMode("img");

    const handleApply = () => {
        setAdminToday(tempToday);
        setAdminStart(tempStart);
        setAdminEnd(tempEnd);
        setLocale(tempLocale);
        setAdminVoted(tempVoted);
    };

    const handleClosePopup = () => {
        setShowImagePopup(false);
    };

    const resetResultImage = async () => {
        setLocalResultImg(null);
        alert("결과 이미지 초기화!");
    }

    const handleGetResultImage = async () => {
        try {
          setImageLoading(true);
      
          // 만약 이미 localResultImg가 있으면 그냥 팝업
          if (localResultImg) {
            setShowImagePopup(true);
            return;
          }
      
          // (1) 서버에 한번에 요청
          const response = await fetch(`/api/get-put-result-img?pollId=${poll_id}`);
          if (!response.ok) {
            const data = await response.json();
            alert(`이미지 생성 오류: ${data?.error || response.statusText}`);
            return;
          }
      
          // (2) 결과 파싱
          const data = await response.json();
          if (!data.success) {
            alert(`이미지 생성 오류: ${data?.error || "Unknown"}`);
            return;
          }
      
          // (3) 서버가 최종 URL 반환
          const finalURL = data.finalURL;
          const announcementText = data.announcementText;
          console.log(announcementText);
      
          // (4) React state 갱신
          setLocalResultImg(finalURL);
          setShowImagePopup(true);
          setAnnounceText(announcementText);
      
        } catch (err) {
          console.error("handleGetResultImage error:", err);
          alert("이미지 생성 도중 오류가 발생했습니다!");
        } finally {
          setImageLoading(false);
        }
    };

    const uploadToX = async () => {
        try {
            if (!poll.announce_result) {
                const wouldOpen = window.confirm("Announcement 문구가 없습니다.\n구글 시트에서 announce_result의 값을 입력한 뒤, 새로고침해주세요.\n\n구글 시트를 열까요?");
                if (!wouldOpen) return;
                window.open(
                    "https://docs.google.com/spreadsheets/d/1ZRL_ifqMs35BHOgYMxY59xUTb-l5r2HdCnI1GTneni4/edit?gid=0#gid=0",
                    "_blank"
                );
                return;
            }

            if (!poll.result_img && !localResultImg) {
                alert("결과 발표 이미지가 없습니다.\n'Get Result Image'버튼을 선행하거나 구글 시트에서 result_img의 값을 입력한 뒤, 새로고침해주세요.");
                return;
            }

            setAnnounceText(poll.announce_result);
            setScheduledTime(defaultScheduledTime);
            setShowXUploadPopup(true);

        } catch (error) {
            console.error("uploadToX error:", error);
            alert("오류가 발생했습니다: " + error.message);
        }
    }

    const handleConfirmUploadX = async () => {
        const sure = window.confirm(`
            정말 업로드할까요?\n
            예약 시간: 
            ----------------
            ${scheduledTime.toLocaleString().replace('T',' ')}
            ----------------

            문구: 
            ----------------
            ${announceText}
            ----------------
          `);
        if (!sure) return;

        try {
            const dateObj = new Date(scheduledTime);
            if (dateObj <= new Date()) {
                const immediateRes = await fetch("/api/tweet-immediate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: announceText,
                        imageUrl: poll.result_img || localResultImg,
                        scheduledAt: toLocalInputString(new Date()).replace('T',' '),
                        poll_id: poll.poll_id,
                    }),
                });

                const immediateData = await immediateRes.json();
                if (!immediateData.success) {
                    throw new Error(immediateData.error || "즉시 업로드 실패");
                }

                alert("과거 시각이므로 지금 즉시 업로드를 수행합니다!");
                setShowXUploadPopup(false);
                return;
            }

            const scheduleRes = await fetch("/api/tweet-scheduled", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: announceText,
                    imageUrl: poll.result_img || localResultImg,
                    scheduledAt: scheduledTime,
                    poll_id: poll.poll_id,
                }),
            });
            const scheduleData = await scheduleRes.json();
            if (!scheduleData.success) {
                throw new Error(scheduleData.error || "예약 업로드 실패");
            }

            alert(`업로드가 ${scheduledTime}에 예약되었습니다! (ID: ${scheduleData.schedule_id || "??"})`);
            setShowXUploadPopup(false);
        } catch (err) {
            console.error("handleConfirmUploadX error:", err);
            alert("업로드 중 오류가 발생했습니다: " + err.message);
        }
    }

    if (auth) {
        return (
            <div className="relative">
                <div className="bg-[rgba(52,60,76,1)] text-[var(--foreground)] font-[var(--font-body)] transition-all">
                    {/* 리모컨 열기 버튼 */}
                    <button
                        onClick={() => setShowRemote(!showRemote)}
                        className="fixed right-4 top-4 bg-blue-600 text-white px-3 py-2 rounded-full"
                    >
                        Admin Controller
                    </button>

                    {/* Result Page Function 리모컨 열기 버튼 */}
                    {viewMode === "img" && (
                        <button
                            onClick={() => setShowResultRemote(!showResultRemote)}
                            className="fixed left-4 bottom-4 bg-green-600 text-white px-3 py-2 rounded-full z-10"
                        >
                            Result Page Function
                        </button>
                    )}
    
                    {/* 리모컨 패널 */}
                    {showRemote && (
                        <div className="fixed right-4 top-16 w-80 p-4 bg-white text-black shadow-lg rounded-md z-50">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={handleShowPoll}
                                        className={
                                            (viewMode === "poll" ? "bg-green-600" : "bg-gray-600")
                                            + " text-white px-3 py-2 rounded"
                                        }
                                    >
                                        Show Poll Page
                                    </button>
    
                                    <button
                                        onClick={handleShowImg}
                                        className={
                                            (viewMode === "img" ? "bg-green-600" : "bg-gray-600")
                                            + " text-white px-3 py-2 rounded"
                                        }
                                    >
                                        Show Result Image
                                    </button>
                                </div>
    
                                {/* Today */}
                                <div className="">
                                    <label className="block font-bold mb-1">Today:</label>
                                    <input
                                        type="datetime-local"
                                        value={tempToday}
                                        onChange={(e) => setTempToday(e.target.value)}
                                        className="border px-2 py-1 w-full"
                                    />
                                </div>
                                {/* Start */}
                                <div className="">
                                    <label className="block font-bold mb-1">Start Date:</label>
                                    <input
                                        type="datetime-local"
                                        value={tempStart}
                                        onChange={(e) => setTempStart(e.target.value)}
                                        className="border px-2 py-1 w-full"
                                    />
                                </div>
                                {/* End */}
                                <div className="">
                                    <label className="block font-bold mb-1">End Date:</label>
                                    <input
                                        type="datetime-local"
                                        value={tempEnd}
                                        onChange={(e) => setTempEnd(e.target.value)}
                                        className="border px-2 py-1 w-full"
                                    />
                                </div>
    
                                {/* Locale */}
                                <div className="">
                                    <label className="block font-bold mb-1">Locale:</label>
                                    <select
                                    value={tempLocale}
                                    onChange={(e) => setTempLocale(e.target.value)}
                                    className="border px-2 py-1 w-full"
                                    >
                                    <option value="en">English (en)</option>
                                    <option value="ko">Korean (ko)</option>
                                    </select>
                                </div>
    
                                {/* Voted 체크박스 */}
                                <div className="flex items-center">
                                    <input
                                    id="votedCheckbox"
                                    type="checkbox"
                                    checked={tempVoted}
                                    onChange={(e) => setTempVoted(e.target.checked)}
                                    className="mr-2"
                                    />
                                    <label htmlFor="votedCheckbox" className="font-bold">
                                        Voted
                                    </label>
                                </div>
                            </div>
    
                            {/* Apply/Close 등 버튼 */}
                            <div className="flex justify-end gap-2 mt-8">
                                <button
                                    onClick={handleApply}
                                    className="bg-green-600 text-white px-3 py-2 rounded"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={() => setShowRemote(false)}
                                    className="bg-gray-400 text-white px-3 py-2 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Result Page Function 리모컨 패널 */}
                    {showResultRemote && (
                        <div className="fixed left-4 bottom-16 p-4 bg-white text-black shadow-lg rounded-md z-50">
                            <div className="relative flex gap-2 mx-auto">
                                <button
                                    onClick={handleGetResultImage}
                                    className="bg-blue-600 text-white px-3 py-2 rounded"
                                    disabled={imageLoading}
                                >
                                    {imageLoading ? 'Wait for it...' : 'Get Result Image'}
                                </button>

                                <button
                                    onClick={resetResultImage}
                                    className="bg-red-600 text-xs text-white px-2 py-2 rounded"
                                    disabled={imageLoading}
                                >
                                    {imageLoading ? 'Wait for it...' : 'Reset'}
                                </button>
                            </div>

                            <button
                                onClick={uploadToX}
                                className="bg-black text-white px-2 py-2 rounded w-full mt-2"
                                disabled={imageLoading}
                            >
                                {imageLoading ? 'Wait for it...' : 'Upload To X'}
                            </button>
                        </div>
                    )}

                    {/* Get Result Image 팝업 */}
                    {showImagePopup && localResultImg && (
                        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 z-50 flex items-center justify-center" 
                            onClick={handleClosePopup}
                        >
                            <div className="bg-black rounded shadow-md relative z-20" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={handleClosePopup}
                                    className="absolute top-2 right-2"
                                >
                                    X
                                </button>
                                <img src={localResultImg} alt="Result Preview" width={700} />
                            </div>
                        </div>
                    )}

                    {/* Upload to X 팝업 */}
                    {showXUploadPopup && (
                        
                        <div
                            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center backdrop-blur-sm overflow-y-scroll"
                            onClick={() => setShowXUploadPopup(false)}
                        >
                            <div
                                className="bg-white text-black p-4 rounded shadow-md relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h1 className="text-xl font-bold mb-2">Upload to X (Twitter)</h1>

                                {/* 이미지 미리보기 */}
                                {localResultImg && (
                                    <img
                                    src={poll.result_img || localResultImg}
                                    alt="preview"
                                    className="w-full h-auto mb-4"
                                    style={{ 
                                        width: "512px",
                                        height: "397px"
                                    }}
                                    />
                                )}

                                {/* 문구 편집기 */}
                                <label className="block font-bold mb-1">Announcement Text:</label>
                                <textarea
                                    value={announceText}
                                    onChange={(e) => setAnnounceText(e.target.value.replace(/,/g, '，'))}
                                    className="border w-full h-24 p-2 mb-3"
                                />

                                {/* 업로드 예약 시간 */}
                                <label className="block font-bold mb-1">Schedule Time:</label>
                                <input
                                    type="datetime-local"
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    className="border w-full px-2 py-1"
                                />

                                {/* 버튼들 */}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        onClick={() => setShowXUploadPopup(false)}
                                        className="bg-gray-400 text-white px-3 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmUploadX}
                                        className="bg-blue-600 text-white px-3 py-2 rounded"
                                    >
                                        UPLOAD
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
    
                    {viewMode === "poll" ? (
    
                        <main className="flex-grow max-w-[480px] mx-auto min-h-dvh overflow-x-hidden
                                         bg-[url('/poll-bg.png')] bg-top bg-no-repeat bg-fixed
                                        bg-black bg-blend-multiply bg-opacity-15
                                        shadow-xl">
                            <Poll
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
                                <div 
                                    className="scale-[0.65] absolute">
                                    <PollCardResult poll_id={poll_id} result={result} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh bg-black items-center justify-center">
            {!blockPassword && (
            <div className="relative w-1/3 grid grid-cols-1 gap-2 mx-auto py-60">
                <input
                    type="text"
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="border px-2 py-1 w-full bg-transparent"
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
    )
};

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