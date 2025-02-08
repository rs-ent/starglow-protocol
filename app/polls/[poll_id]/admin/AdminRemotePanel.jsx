// /components/PollAdmin/AdminRemotePanel.js
import React from "react";

export default function AdminRemotePanel({
  viewMode,
  onShowPoll,
  onShowImg,
  tempToday,
  setTempToday,
  tempStart,
  setTempStart,
  tempEnd,
  setTempEnd,
  tempLocale,
  setTempLocale,
  tempVoted,
  setTempVoted,
  onApply,
  onClose,
}) {
  return (
    <div className="fixed right-4 top-16 w-80 p-4 bg-white text-black shadow-lg rounded-md z-50">
      <div className="flex gap-2 mb-4">
        <button
          onClick={onShowPoll}
          className={`${
            viewMode === "poll" ? "bg-green-600" : "bg-gray-600"
          } text-white px-3 py-2 rounded`}
        >
          Show Poll Page
        </button>
        <button
          onClick={onShowImg}
          className={`${
            viewMode === "img" ? "bg-green-600" : "bg-gray-600"
          } text-white px-3 py-2 rounded`}
        >
          Show Result Image
        </button>
      </div>
      <div className="mb-2">
        <label className="block font-bold mb-1">Today:</label>
        <input
          type="datetime-local"
          value={tempToday}
          onChange={(e) => setTempToday(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block font-bold mb-1">Start Date:</label>
        <input
          type="datetime-local"
          value={tempStart}
          onChange={(e) => setTempStart(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block font-bold mb-1">End Date:</label>
        <input
          type="datetime-local"
          value={tempEnd}
          onChange={(e) => setTempEnd(e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>
      <div className="mb-2">
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
      <div className="flex items-center mb-2">
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
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onApply}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Apply
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-3 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
