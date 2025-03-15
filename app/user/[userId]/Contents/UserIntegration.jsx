"use client";

import { useEffect, useRef } from "react";

export default function UserIntegration({ userData = {}, owner = false }) {
    const telegramWrapper = useRef(null);

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

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">Integration</h1>
            <p className="text-[var(--text-secondary)] mt-4">This is the integration page.</p>

            <div className="flex gap-4 items-center mt-8 rounded-lg border border-[var(--border-mid)] p-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Telegram</h2>

                <div ref={telegramWrapper} />
            </div>
        </div>
    );
}
