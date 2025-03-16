/// app\user\UserPending.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEncryptedLocalUserData } from "../scripts/user/user";
import ZkLoginModal from "../components/zkLoginModal";
import Spinner from "../components/Spinner";

export default function UserPending() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStorageChange = async (event) => {
            if (event.key === "userData") {
                setLoading(true);
                const user = await getEncryptedLocalUserData();
                if (user?.docId) {
                    router.push(`/user/${user.docId}`);
                    setLoading(false);
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
            {/* Loading spinner */}
            {loading && <Spinner />}

            <ZkLoginModal
                isModal={false}
            />
        </div>
    )
}
