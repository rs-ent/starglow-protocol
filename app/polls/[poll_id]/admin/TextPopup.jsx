// /components/PollAdmin/TextPopup.js
import React from "react";

export default function TextPopup({ text, onClose }) {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-black rounded shadow-md relative z-20 p-4 w-[70%] h-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-white">
          X
        </button>
        {/* readOnly 속성으로 텍스트 영역을 사용 */}
        <textarea
          className="w-full h-full bg-gray-800 text-white p-2 rounded resize-none"
          value={text}
          readOnly
        />
      </div>
    </div>
  );
}
