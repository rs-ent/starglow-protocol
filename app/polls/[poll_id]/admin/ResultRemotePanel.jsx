// /components/PollAdmin/ResultRemotePanel.js
import React from "react";

export default function ResultRemotePanel({
  imageLoading,
  onGetResultImage,
  onResetResultImage,
  onUploadToX,
}) {
  return (
    <div className="fixed left-4 bottom-16 p-4 bg-white text-black shadow-lg rounded-md z-50">
      <div className="flex gap-2 mb-2">
        <button
          onClick={onGetResultImage}
          disabled={imageLoading}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          {imageLoading ? "Wait for it..." : "Get Result Image"}
        </button>
        <button
          onClick={onResetResultImage}
          disabled={imageLoading}
          className="bg-red-600 text-white px-2 py-2 rounded text-xs"
        >
          {imageLoading ? "Wait for it..." : "Reset"}
        </button>
      </div>
      <button
        onClick={onUploadToX}
        disabled={imageLoading}
        className="bg-black text-white px-2 py-2 rounded w-full"
      >
        {imageLoading ? "Wait for it..." : "Upload To X"}
      </button>
    </div>
  );
}
