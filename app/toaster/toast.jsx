/// app\toaster\toast.jsx

import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const toaster = ({
  message,
  type = "info",
  position = "top-right",
  duration = 5000,
  textSize = "14px",
  background = null,
  textColor = "#FFFFFF",
  borderRadius = "8px",
  border = "none",
  boxShadow = "0px 4px 12px rgba(0,0,0,0.1)",
  icon = null,
  action = null,
  closeButton = false,
  cursor = "pointer",
  className = "",
  onClick = null,
}) => {
  if (!message) {
    console.warn("toaster: message 옵션은 필수 값입니다.");
    return;
  }

  if (action && (!action.label || !action.onClick)) {
    console.warn("toaster: action 설정 시 label과 onClick은 필수입니다.");
    action = null;
  }

  // 타입별 기본 설정 (배경색 & 아이콘)
  const typeConfigs = {
    success: {
      background: "#22C55E",
      icon: <CheckCircle size={18} />,
    },
    error: {
      background: "#EF4444",
      icon: <XCircle size={18} />,
    },
    warning: {
      background: "#FACC15",
      icon: <AlertTriangle size={18} />,
    },
    info: {
      background: "#3B82F6",
      icon: <Info size={18} />,
    },
  };

  const typeConfig = typeConfigs[type] || typeConfigs.info;

  const options = {
    position,
    duration,
    icon: icon || typeConfig.icon,
    action,
    closeButton,
    className,
    style: {
      fontSize: textSize,
      backgroundColor: background || typeConfig.background,
      color: textColor,
      borderRadius,
      border,
      boxShadow,
      cursor,
    },
    onClick: onClick || (() => toast.dismiss(id)),
  };

  let id;

  switch (type) {
    case "success":
      id = toast.success(message, options);
      break;
    case "error":
      id = toast.error(message, options);
      break;
    case "warning":
      id = toast.warning(message, options);
      break;
    default:
      id = toast.info(message, options);
      break;
  }
};

export default toaster;
