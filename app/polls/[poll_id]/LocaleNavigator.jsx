"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LocaleNavigator({ poll_id }) {
    const router = useRouter();

    useEffect(() => {
        let locale = "en";
        if (navigator.language.toLowerCase().startsWith("ko")) {
            locale = "ko";
        }
        router.replace(`/polls/${poll_id}/${locale}`);
    }, [poll_id, router]);

    return null;
}