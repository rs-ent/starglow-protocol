"use client";

import { useEffect, useState, useRef } from "react";
import { updateUserData } from "../../../firebase/user-data";
import Image from "next/image";

export default function UserIntegration({ userData = {}, owner = false }) {
    const telegramWrapper = useRef(null);
    const [telegramDeprecated, setTelegramDeprecated] = useState(false);

    useEffect(() => {
        // Telegram 위젯 로드 중복 방지
        if (!telegramWrapper.current || telegramWrapper.current.childNodes.length > 0) {
            return;
        }

        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "starglow_redslippers_bot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-userpic", "false");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-auth-url", `${window.location.origin}/oauth/callback/telegram`);

        telegramWrapper.current.appendChild(script);
    }, [telegramWrapper]);

    const handleTelegramUnlink = async () => {
        setTelegramDeprecated(true);
        const updatedTelegramData = userData.telegram;
        updatedTelegramData.deprecated = true;
        updatedTelegramData.deprecated_at = new Date().toISOString();
        userData.telegram = updatedTelegramData;
        await updateUserData(userData.docId, userData);
    };

    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">Integration</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-3">Connect your account with other services</p>

            <div className="w-full border-t border-t-[rgba(255,255,255,0.1)] mt-20 mb-12" />

            <div className="flex gap-4 rounded-lg border border-[var(--border-mid)] p-4 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image src="/ui/telegram-icon.png" width={30} height={30} />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Telegram</h2>
                </div>

                {!userData.telegram?.deprecated && !telegramDeprecated ? (
                    <div className="flex gap-4 items-center">
                    <div className="text-right">
                        <p className="text-[var(--text-primary)]">{userData.telegram.first_name} {userData.telegram.last_name}</p>
                        <p className="text-[var(--text-secondary)] text-xs">Linked at {userData.telegram.linked_at.split("T")[0]}</p>
                    </div>
                        <button 
                            className="bg-[rgba(255,50,50,0)] text-[rgba(255,50,50,0.9)] border border-[rgba(255,50,50,0.5)] px-4 py-2 rounded-lg text-xs 
                                        hover:bg-[rgba(255,50,50,0.9)] hover:text-[rgba(255,255,255,0.9)] transition-all"
                            onClick={handleTelegramUnlink}
                        >
                            Unlink
                        </button>
                    </div>
                ): (
                    <div ref={telegramWrapper} />
                )}
            </div>
        </div>
    );
}
