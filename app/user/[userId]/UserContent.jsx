/// app\user\[userId]\UserContent.jsx

"use client";

import { useEffect, useState } from "react";
import UserIntegration from "./Contents/UserIntegration";

export default function UserContent({ contentType = "", userData = {}, owner = false }) {

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(<div></div>);

  useEffect(() => {
    if (contentType === "integration") {
      setContent(<UserIntegration userData={userData} owner={owner} />);
    } else {
      setContent(<div></div>);
    }
  }, [contentType]);

  return (
    <main className="flex-1 p-6 bg-[rgba(255,255,255,0.03)]">
      {content}
    </main>
  );
}
