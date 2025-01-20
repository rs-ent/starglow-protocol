"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PollHome() {
    const { poll_id } = useParams();
    const router = useRouter();

    useEffect(() => {
        let locale = "en";
        if (navigator.language.toLowerCase().startsWith("ko")) {
            locale = "ko";
        }
        router.replace(`/polls/${poll_id}/${locale}`);
        
    }, [poll_id, router]);
};