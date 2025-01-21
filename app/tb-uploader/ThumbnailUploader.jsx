"use client";

import { useState } from "react";
import { uploadFiles } from "../firebase/fetch";

export default function ThumbnailUploader() {
    const [uploadedResults, setUploadedResults] = useState([]);
    const [uploadProgress, setUploadProgress] = useState([]);

    const [toastMessage, setToastMessage] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
    
        // 3초 후에 자동으로 닫힘
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setUploadProgress([]);
        setUploadedResults([]);

        if (files.length === 0) return;

        try {
            const results = await uploadFiles(files, "uploads/", (index, progress) => {
                setUploadProgress((prev) => {
                    const updated = [...prev];
                    updated[index] = progress.toFixed(1);
                    return updated;
                });
            });
            setUploadedResults(results);
        } catch (error) {
            console.error("Upload error:", error);
            triggerToast("파일 업로드에 실패했습니다...");
        }
    };

    const handleUrlClick = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            triggerToast("URL이 클립보드에 복사되었습니다!");
        } catch (err) {
            console.error("Failed to copy url:", err);
            triggerToast("URL 복사에 실패했습니다.");
        }
    };

    return (
        <div className="bg-black min-h-screen">
            {/* 토스트 메시지 박스 */}
            <div
                className={`
                    fixed top-4 right-4 z-50
                    bg-green-600 text-white px-4 py-2 rounded shadow
                    transition-opacity duration-500
                    ${showToast ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
            >
                {toastMessage}
            </div>
            <div className="p-4 max-w-6xl mx-auto py-20">
                <h2 className="text-2xl font-bold mb-4">Thumbnail Uploader</h2>
            
                {/* 파일 선택 */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4"
                />

                {/* 업로드 진행률 표시 */}
                {uploadProgress.map((prog, i) => (
                    <div key={i} className="text-sm mb-1">
                        File #{i} Progress: {prog}%
                    </div>
                ))}
            
                {/* 업로드 완료 후 결과 미리보기 / URL */}
                {uploadedResults.length > 0 && (
                    <div className="mt-4 border p-2 rounded">
                        <h3 className="font-semibold mb-2">Completed</h3>
                        <div className="grid grid-cols-2 gap-8 p-6">
                            {uploadedResults.map((res, i) => (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <img
                                        src={res.downloadURL}
                                        alt="uploaded thumbnail"
                                        className="w-full h-full object-cover rounded border"
                                    />
                                    <button
                                        onClick={() => handleUrlClick(res.downloadURL)}
                                        className="text-blue-600 underline text-xs mt-1 break-all"
                                        style={{ maxWidth: "6rem" }}
                                    >
                                        {res.downloadURL.slice(0, 30)}...
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};