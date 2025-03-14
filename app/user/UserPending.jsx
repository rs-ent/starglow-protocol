/// app\user\UserPending.jsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserAddressWithUserData } from "../sui/client-utils";
import ZkLoginModal from "../components/zkLoginModal";

export default function UserPending() {
    const router = useRouter();

    useEffect(() => {
        const handleStorageChange = async (event) => {
            if (event.key === "userData") {
                const { address, user } = getUserAddressWithUserData();
                if (user.docId) {
                    user.suiAddress = address;
                    const res = await fetch("/api/session-storage/user", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userData: user }),
                    });
                    const data = await res.json();
                    if(data.message) {
                        router.push(`/user/${user.docId}`);
                    }
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[rgba(5,23,38,1)] to-[rgba(15,20,11,1)]">
            <ZkLoginModal
                isModal={false}
            />
        </div>
    )
}
