"use client";

import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../../context/PollData";
import Poll from "../[locale]/Poll";
import LocaleFile from "../[locale]/LocaleFile";
import PollCardResult from "../../result/PollCard.Result";
import { uploadFiles, updateResultImg } from "../../../firebase/fetch";

const ADMIN_PASSWORD = "레드슬리퍼스01!";

export default function PollAdmin({poll_id, result}) {
    const [locale, setLocale] = useState('en');
    const [t, setT] = useState(null);
    const [auth, setAuth] = useState(false);

    const pollData = useContext(DataContext);
    const poll = pollData?.[poll_id];
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
    const [imageURL, setImageURL] = useState(null);
    const [localResultImg, setLocalResultImg] = useState(result?.result_img || null);
    const [imageLoading, setImageLoading] = useState(false);

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
        setImageURL(null);
    };

    const resetResultImage = async () => {
        setLocalResultImg(null);
        setImageURL(null);
        handleGetResultImage();
    }

    const handleGetResultImage = async () => {
        try {
            setImageLoading(true);
            if (localResultImg) {
                setImageURL(localResultImg);
                setShowImagePopup(true);
                return;
            }

            const response = await fetch(`/api/get-result?pollId=${poll_id}`);
            if (!response.ok) {
                alert(`이미지 생성 오류: ${res.statusText}`);
                return;
            }

            const blob = await response.blob();
            const file = new File([blob], `poll_${poll_id}.png`, { type: "image/png" });
            const [uploadResult] = await uploadFiles([file], "poll-results/");
            if (!uploadResult.downloadURL) {
                alert("업로드에 실패했습니다.");
                return;
            }
            const finalURL = uploadResult.downloadURL;
            await updateResultImg(poll_id, finalURL);

            setLocalResultImg(finalURL);
            setImageURL(finalURL);
            setShowImagePopup(true);

        } catch (err) {
            console.error("handleGetResultImage error:", err);
            alert("이미지 생성 도중 오류가 발생했습니다!");
        } finally {
            setImageLoading(false);
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
                            <div className="relative flex gap-4 mx-auto">
                                <button
                                    onClick={handleGetResultImage} // 구현할 함수
                                    className="bg-blue-600 text-white px-3 py-2 rounded"
                                    disabled={imageLoading}
                                >
                                    {imageLoading ? 'Wait for it...' : 'Get Result Image'}
                                </button>

                                <button
                                    onClick={resetResultImage} // 구현할 함수
                                    className="bg-red-600 text-white px-3 py-2 rounded"
                                    disabled={imageLoading}
                                >
                                    {imageLoading ? 'Wait for it...' : 'Reset'}
                                </button>
                            </div>
                        </div>
                    )}

                    {showImagePopup && imageURL && (
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