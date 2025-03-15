/// app\oauth\callback\telegram\page.jsx

"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function TelegramAuthCallback() {
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
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                router.push("/integration-success");
            } else {
                router.push("/integration-failed");
            }
        });
    }, [params, router]);

    return (
        <div className="bg-black">
        </div>
    );
}
