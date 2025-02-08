// /components/PollAdmin/UploadXPopup.js
import React from "react";

export default function UploadXPopup({
  announceText,
  setAnnounceText,
  scheduledTime,
  setScheduledTime,
  onClose,
  onConfirmUpload,
  imageSrc,
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center backdrop-blur-sm overflow-y-scroll"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-4 rounded shadow-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-xl font-bold mb-2">Upload to X (Twitter)</h1>
        {imageSrc && (
          <img
            src={imageSrc}
            alt="preview"
            className="w-full h-auto mb-4"
            style={{ width: "512px", height: "397px" }}
          />
        )}
        <label className="block font-bold mb-1">Announcement Text:</label>
        <textarea
          value={announceText}
          onChange={(e) => setAnnounceText(e.target.value.replace(/,/g, "，"))}
          className="border w-full h-24 p-2 mb-3"
        />
        <label className="block font-bold mb-1">Schedule Time:</label>
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="border w-full px-2 py-1"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-3 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmUpload}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            UPLOAD
          </button>
        </div>
      </div>
    </div>
  );
}
