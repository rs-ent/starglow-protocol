import { toast } from "sonner";

/**
 * 토스트 알림
 *
 * @param {Object} params - 토스트 옵션 객체
 * @param {string} params.message - 토스트에 표시할 메시지 (필수)
 * @param {"success"|"error"|"warning"|"info"} [params.type="info"] - 토스트 메시지의 유형
 * @param {"top-right"|"top-left"|"top-center"|"bottom-right"|"bottom-left"|"bottom-center"} [params.position="top-right"] - 토스트 위치
 * @param {number} [params.duration=5000] - 토스트 표시 시간(ms)
 * @param {string} [params.textSize="14px"] - 텍스트 크기 (CSS 단위)
 * @param {string} [params.background="#90B07B"] - 배경색 (CSS 컬러)
 * @param {string} [params.textColor="#FFFFFF"] - 글자색 (CSS 컬러)
 * @param {string} [params.borderRadius="8px"] - 모서리 둥글기 (CSS 단위)
 * @param {string} [params.border="none"] - 테두리 스타일 (CSS 스타일)
 * @param {string} [params.boxShadow="0px 4px 12px rgba(0,0,0,0.1)"] - 그림자 효과 (CSS 스타일)
 * @param {React.ReactNode|string|null} [params.icon=null] - 표시할 아이콘 컴포넌트 또는 이모지
 * @param {Object|null} [params.action=null] - 액션 버튼 옵션
 * @param {string} params.action.label - 액션 버튼 텍스트
 * @param {Function} params.action.onClick - 액션 버튼 클릭 핸들러
 * @param {boolean} [params.closeButton=false] - 닫기 버튼 표시 여부
 * @param {string} [params.cursor="pointer"] - 마우스 커서 스타일 (CSS cursor 옵션)
 * @param {string} [params.className=""] - 추가 CSS 클래스
 */
const toaster = ({
  message = "",
  type = "info",
  position = "top-right",
  duration = 5000,
  textSize = "14px",
  background = "#90B07B",
  textColor = "#FFFFFF",
  borderRadius = "8px",
  border = "none",
  boxShadow = "0px 4px 12px rgba(0,0,0,0.1)",
  icon = null,
  action = null,
  closeButton = false,
  cursor = "pointer",
  className = "",
}) => {
  const options = {
    position,
    duration,
    icon,
    action,
    closeButton,
    className,
    style: {
      fontSize: textSize,
      backgroundColor: background,
      color: textColor,
      borderRadius,
      border,
      boxShadow,
      cursor, // 사용자 지정 커서 추가
    },
  };

  let id;

  const handleClick = () => toast.dismiss(id);

  switch (type) {
    case "success":
      id = toast.success(message, { ...options, onClick: handleClick });
      break;
    case "error":
      id = toast.error(message, { ...options, onClick: handleClick });
      break;
    case "warning":
      id = toast.warning(message, { ...options, onClick: handleClick });
      break;
    case "info":
    default:
      id = toast.info(message, { ...options, onClick: handleClick });
      break;
  }
};

export default toaster;
