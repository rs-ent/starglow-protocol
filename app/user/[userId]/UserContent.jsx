/// app\user\[userId]\UserContent.jsx

"use client";

import { useEffect, useState } from "react";
import UserIntegration from "./Contents/UserIntegration";
import NFTMinting from "./Contents/NFTMinting";

export default function UserContent({ contentType = "", userData = {}, owner = false }) {

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(<div></div>);

  useEffect(() => {
    switch (contentType) {
      case "integration":
        setContent(<UserIntegration userData={userData} owner={owner} />);
        break;
      case "nft-mint":
        setContent(<NFTMinting userData={userData} />);
        break;
      default:
        setContent(<div></div>);
        break;
    }
  }, [contentType]);

  return (
    
    <main className="flex-1 p-6 bg-[rgba(255,255,255,0.03)]">
      {content}
    </main>
  );
}
