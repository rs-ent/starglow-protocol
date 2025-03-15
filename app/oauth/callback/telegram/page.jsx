/// app\oauth\callback\telegram\page.jsx

"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function TelegramAuthHandler() {
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const telegramData = {
            id: params.get("id"),
            first_name: params.get("first_name"),
            last_name: params.get("last_name"),
            username: params.get("username"),
            auth_date: params.get("auth_date"),
            hash: params.get("hash"),
            photo_url: params.get("photo_url"),
        };

        fetch("/api/telegram/integrate", {
            method: "POST",
            body: JSON.stringify({ telegramData }),
            headers: { "Content-Type": "application/json" },
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
            return res.json();
        })
        .then(result => {
            if (result.success) {
                router.push("/user");
            } else {
                router.push("/");
            }
        })
        .catch(error => {
            console.error("Telegram integration failed:", error);
            router.push("/");
        });
    }, [params, router]);

    return (
        <div className="bg-black flex justify-center items-center h-screen">
            <p className="text-white">Processing Telegram integration...</p>
        </div>
    );
}

export default function TelegramAuthCallback() {
    return (
        <Suspense fallback={
            <div className="bg-black flex justify-center items-center h-screen">
                <p className="text-white">Loading...</p>
            </div>
        }>
            <TelegramAuthHandler />
        </Suspense>
    );
}