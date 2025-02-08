// /components/PollAdmin/AnnouncementPanel.js
import React, { useState } from "react";
import ImagePopup from "./ImagePopup";
import Spinner from "../../../components/Spinner";
import TextPopup from "./TextPopup";
import { uploadFiles } from "../../../firebase/fetch";
import { CreateAnnouncementText } from "../../../scripts/create-announcemnet-text";

export default function AnnouncementPanel({ pollData }) {
  const [loading, setLoading] = useState(false);
  const [popupImageSrc, setPopupImageSrc] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState(null);
  const [showText, setShowText] = useState(false);

  const pollId = pollData?.poll_id;
  const songTitles = pollData?.song_title ? pollData.song_title.split(";") : [];

  // API 호출 후 Blob을 받아 File로 변환 후 Firebase Storage에 업로드
  const fetchAndUploadImage = async (url, songIdx = null) => {
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("네트워크 응답 오류");
      }
      const blob = await res.blob();
      // songIdx 값이 전달되면 파일명에 포함, 없으면 poll 이미지용으로 처리
      const fileName =
        songIdx !== null
          ? `song_${pollId}_${songIdx}.png`
          : `poll_${pollId}.png`;
      const file = new File([blob], fileName, { type: blob.type });
      // uploadFiles 함수는 배열을 받으므로, 파일을 배열에 담아서 호출합니다.
      const uploadResults = await uploadFiles(
        [file],
        songIdx !== null ? "today-song/" : "today-poll/"
      );
      if (uploadResults && uploadResults.length > 0) {
        const downloadURL = uploadResults[0].downloadURL;
        setPopupImageSrc(downloadURL);
        setShowPopup(true);
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  // "Get Image : Today's Song" 버튼 클릭 핸들러
  const handleGetTodaySongImage = (songIdx) => {
    const url = `/api/get-today-song?pollId=${pollData.poll_id}&songIdx=${songIdx}`;
    fetchAndUploadImage(url, songIdx);
  };

  // "Get Image : Today's Poll" 버튼 클릭 핸들러
  const handleGetTodayPollImage = () => {
    const url = `/api/get-today-poll?pollId=${pollData.poll_id}`;
    fetchAndUploadImage(url);
  };

  // Announcement 텍스트 생성 버튼 핸들러
  const handleGetAnnouncmentText = () => {
    console.log(pollData);
    const message = CreateAnnouncementText(pollData);
    setPopupText(message);
    setShowText(true);
  };

  return (
    <div className="fixed left-4 top-16 p-4 bg-white text-black shadow-lg rounded-md z-50">
      {loading && <Spinner />}
      <div className="grid grid-cols-2">
        <div>
          {songTitles.map((title, idx) => (
            <button
              key={idx}
              onClick={() => handleGetTodaySongImage(idx)}
              className="bg-blue-500 text-white px-3 py-2 rounded m-1"
            >
              {`Get Image : Today's Song 『${title}』`}
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={handleGetTodayPollImage}
            className="bg-blue-500 text-white px-3 py-2 rounded m-1"
          >
            {"Get Image : Today's Poll"}
          </button>
          <div>
            <button
              onClick={handleGetAnnouncmentText}
              className="bg-blue-500 text-white px-3 py-2 rounded m-1"
            >
              {"Get Announcement Text"}
            </button>
          </div>
        </div>
      </div>
      {showPopup && popupImageSrc && (
        <ImagePopup
          imageSrc={popupImageSrc}
          onClose={() => {
            setShowPopup(false);
            setPopupImageSrc(null);
          }}
        />
      )}
      {showText && popupText && (
        <TextPopup
          text={popupText}
          onClose={() => {
            setShowText(false);
            setPopupText(null);
          }}
        />
      )}
    </div>
  );
}
