// components/Comments.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  ref,
  query,
  orderByChild,
  limitToLast,
  onValue,
  equalTo,
  push,
  update,
  remove,
} from "firebase/database";
import { database } from "../firebase/firestore-voting";
import Image from "next/image";
import { getGeographic } from "../scripts/device-info";

// 커스텀 상대 시간 함수 (또는 별도로 import)
export function customFormatDistance(diff) {
  const seconds = Math.floor(diff / 1000);
  if (seconds < 2) return `just now`;
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export function maskIp(ip) {
  const cleanedIp = ip.replace(/,/g, ".");
  const segments = cleanedIp.split(".");
  if (segments.length < 2) return ip;
  const visible = segments.slice(0, 2);
  const masked = segments.slice(2).map((seg) => "*".repeat(seg.length));
  return visible.concat(masked).join(".");
}

function Comments({
  poll = { poll_id: "global" },
  needCloseButton = false,
  onCloseComments,
}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [myIp, setMyIp] = useState("");
  const [limitCount, setLimitCount] = useState(20);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [now, setNow] = useState(Date.now());
  const [contextMenu, setContextMenu] = useState(null);

  const containerRef = useRef(null);
  const initialLoad = useRef(true);
  const sendButtonRef = useRef(null);
  const timerRef = useRef(null);
  const poll_id = poll.poll_id;

  // 상위에서 단 하나의 Interval로 현재 시간을 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // 컴포넌트 마운트 시 IP 주소 가져오기
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setMyIp(data.ip))
      .catch((error) => console.error("IP 가져오기 에러:", error));
  }, []);

  // poll_id에 해당하는 댓글만 가져오기 (필터링)
  useEffect(() => {
    const commentsRef = ref(database, "comments");
    const q = query(
      commentsRef,
      orderByChild("poll_id"),
      equalTo(poll_id),
      limitToLast(limitCount)
    );
    const unsubscribe = onValue(q, (snapshot) => {
      const data = snapshot.val();
      const commentsList = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [
            {
              id: "placeholder",
              text: "Leave your comment!",
              sub: poll.title || "",
            },
          ];
      commentsList.sort((a, b) => a.createdAt - b.createdAt);
      setComments(commentsList);
    });
    return () => unsubscribe();
  }, [limitCount, poll_id, poll.title]);

  // 최초 로딩 시에만 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (initialLoad.current && comments.length > 0 && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
      initialLoad.current = false;
    }
  }, [comments]);

  // 스크롤 이벤트: 스크롤이 최상단에 도달하면 과거 댓글을 더 로드
  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) {
      setLimitCount((prev) => prev + 20);
    }
  };

  // 댓글 추가 (등록 후 자동 스크롤)
  const addComment = async () => {
    if (!newComment.trim()) return;

    /*let geo = {};
    try {
      const res = await fetch(`/api/get-geograhpic?ip=${myIp}`);
      if (!res.ok) {
        console.error("Error fetching geo data for ip:", myIp, await res.text());
      } else {
        geo = await res.json();
      }
    } catch (error) {
      console.error("Error fetching geo data:", error);
    }*/

    const comment = {
      text: newComment,
      createdAt: Date.now(),
      ip: myIp,
      poll_id: poll_id,
    };

    push(ref(database, "comments"), comment);
    setNewComment("");
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // 편집 관련 함수들
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };
  const saveEdit = (commentId) => {
    const commentRef = ref(database, `comments/${commentId}`);
    update(commentRef, { text: editingCommentText });
    setEditingCommentId(null);
    setEditingCommentText("");
  };
  const handleDelete = (commentId) => {
    const commentRef = ref(database, `comments/${commentId}`);
    remove(commentRef);
  };

  // 현재 시간과 댓글 생성 시간의 차이 (밀리초)
  const getTimeDiff = (createdAt) => now - createdAt;
  // 편집/삭제 조건: 편집은 5분 이내, 삭제는 2시간 이내
  const canEdit = (comment) =>
    comment.ip === myIp && getTimeDiff(comment.createdAt) <= 300000;
  const canDelete = (comment) =>
    comment.ip === myIp && getTimeDiff(comment.createdAt) <= 7200000;

  // 오른쪽 클릭(데스크톱) 핸들러
  const handleContextMenu = (e, comment) => {
    e.preventDefault();
    e.stopPropagation();
    const parent = containerRef.current.getBoundingClientRect();

    const xStandard = e.clientX - parent.left;
    const yStandard = e.clientY - parent.top;

    const boxWidth = 75;
    const boxHeight = 75;

    let xAlpha = 0;
    let yAlpha = 0;
    if (xStandard + boxWidth >= parent.width) xAlpha = boxWidth;
    if (yStandard + boxHeight >= parent.height) yAlpha = boxHeight;

    const x = xStandard - xAlpha;
    const y = yStandard - yAlpha;

    setContextMenu({ comment, x: x, y: y });
    clearTimeout(timerRef.current);
  };

  const handleTouchStart = (e, comment) => {
    e.preventDefault();
    e.stopPropagation();
    timerRef.current = setTimeout(() => {
      handleContextMenu(e, comment);
    }, 600);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="relative flex flex-col bg-gradient-to-br from-[rgba(0,0,15,0.8)] to-[rgba(0,0,5,0.6)] rounded-xl h-full backdrop-blur-sm"
    >
      {/* 댓글 목록 영역 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onClick={(e) => {
          e.stopPropagation();
          if (needCloseButton && e.target === e.currentTarget) {
            onCloseComments();
          }
        }}
        className="flex flex-col gap-3 flex-1 overflow-auto py-3"
      >
        {comments.map((comment) => {
          // 내 댓글이면 오른쪽 정렬, 다른 사람 댓글이면 왼쪽 정렬
          const isMyComment = comment.ip === myIp;
          return (
            <div
              key={comment.id}
              onContextMenu={(e) =>
                isMyComment && handleContextMenu(e, comment)
              }
              onTouchStart={(e) =>
                isMyComment &&
                contextMenu.comment.id !== comment.id &&
                handleTouchStart(e, comment)
              }
              onTouchEnd={() => clearTimeout(timerRef.current)}
              onTouchCancel={() => clearTimeout(timerRef.current)}
              onTouchMove={() => clearTimeout(timerRef.current)}
              className={`comment-item mt-2 max-w-[80%] w-fit ${
                isMyComment ? "ml-auto mr-4" : "mr-auto ml-4"
              }`}
            >
              {editingCommentId === comment.id ? (
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                    className="py-2 px-4 bg-[rgba(56,100,168,0.8)] rounded-[20px] break-words font-main text-xs text-[0.75rem]"
                  />
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => saveEdit(comment.id)}
                      className="text-[0.65rem] text-blue-300 mr-3"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-[0.65rem] text-red-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* 내 댓글인 경우 ip 표시는 생략 
                  {!isMyComment && (
                    <div className="text-[0.45rem] text-[rgba(255,255,255,0.5)] mb-0.5 text-left">
                      {comment.geo && comment.geo !== "Unknown" && <span>{maskIp(comment.geo)}:</span>}
                    </div>
                  )}*/}
                  <div
                    className={`flex items-end gap-1 ${
                      isMyComment ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`py-2 px-4 rounded-[1rem] break-words font-main text-[0.7rem] max-w-[77%] ${
                        isMyComment
                          ? "bg-[rgba(100,180,100,0.8)] text-right"
                          : "bg-[rgba(56,100,168,0.8)]"
                      }`}
                    >
                      {comment.sub && (
                        <div className="text-[0.5rem] italic">
                          {comment.sub}
                        </div>
                      )}
                      <div>{comment.text}</div>
                    </div>
                    <div className="text-[0.45rem] text-[rgba(255,255,255,0.6)] italic font-extralight">
                      {comment.createdAt &&
                        customFormatDistance(getTimeDiff(comment.createdAt))}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {/* 댓글 입력 영역 */}
      <div className="flex bg-[var(--background-muted)] p-2 w-full items-center">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addComment();
            }
          }}
          placeholder="Write a comment..."
          className="flex-1 min-w-0 bg-transparent rounded-full text-[rgba(255,255,255,0.85)] outline-none font-main"
        />
        <button ref={sendButtonRef} onClick={addComment} className="ml-2">
          <Image
            src="/ui/send-icon.png"
            alt="Add Comment"
            width={15}
            height={15}
            layout="fixed"
          />
        </button>
      </div>

      {/* 팝업(컨텍스트 메뉴) 렌더링 */}
      {contextMenu && (
        <div
          onClick={() => setContextMenu(null)}
          className="fixed inset-0 z-50 flex items-center justify-center" // 배경 오버레이 스타일 예시
        >
          <div
            className="absolute z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div className="bg-[rgba(30,30,30,0.9)] text-white grid grid-cols-1 rounded shadow-md backdrop-blur-sm">
              <button
                onClick={() => {
                  startEditing(contextMenu.comment);
                  setContextMenu(null);
                }}
                className="block px-4 py-2 hover:bg-[rgba(55,65,81,0) text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[rgba(55,65,81,0)]"
                disabled={!canEdit(contextMenu.comment)}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete(contextMenu.comment.id);
                  setContextMenu(null);
                }}
                className="block px-4 py-2 hover:bg-[rgba(55,65,81,0) text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[rgba(55,65,81,0)]"
                disabled={!canDelete(contextMenu.comment)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comments;
