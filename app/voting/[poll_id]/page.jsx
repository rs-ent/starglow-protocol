"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PollHome({ params }) {
    const { poll_id } = params;
    const router = useRouter();

    useEffect(() => {
        let locale = "en";
        if (navigator.language.toLowerCase().startsWith("ko")) {
            locale = "ko";
        }
        router.replace(`/voting/${poll_id}/${locale}`);
        
    }, [poll_id, router]);

    return <div>Loading...</div>;
};