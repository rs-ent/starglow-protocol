// /components/PollAdmin/ImagePopup.js
import React from "react";

export default function ImagePopup({ imageSrc, onClose }) {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-black rounded shadow-md relative z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-white">
          X
        </button>
        <img src={imageSrc} alt="Result Preview" width={700} />
      </div>
    </div>
  );
}
