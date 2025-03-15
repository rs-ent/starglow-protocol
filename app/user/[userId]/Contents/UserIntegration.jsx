"use client";

import { useEffect, useRef } from "react";

export default function UserIntegration({ userData = {}, owner = false }) {
    const telegramWrapper = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.async = true;
        script.setAttribute("data-telegram-login", "starglow_redslippers_bot");
        script.setAttribute("data-size", "large");
        script.setAttribute("data-userpic", "false");
        script.setAttribute("data-request-access", "write");
        script.setAttribute("data-auth-url", `${window.location.origin}/oauth/callback/telegram`);

        telegramWrapper.current.innerHTML = "";
        telegramWrapper.current.appendChild(script);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">Integration</h1>
            <p className="text-[var(--text-secondary)] mt-4">This is the integration page.</p>

            <div className="flex gap-4 items-center mt-8 rounded-lg border border-[var(--border-mid)] p-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Telegram</h2>

                {/* Telegram 위젯 정상 로드 */}
                <div ref={telegramWrapper} />
            </div>
        </div>
    );
}
