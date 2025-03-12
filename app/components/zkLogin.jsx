/// app\components\zkLogin.jsx

"use client";

import { useEffect, useState } from "react";
import { jwtToAddress } from "@mysten/sui/zklogin";
import Image from 'next/image';
import GoogleOAuth from "../oauth/GoogleOAuth";

export default function ZkLogin() {
    const [suiAddress, setSuiAddress] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin === window.location.origin && event.data.userData) {
                const userData = event.data.userData;
                localStorage.setItem("userData", JSON.stringify(userData));
                console.log("User Data: ", userData);

                const loginMethod = userData.latestLoginMethod;
                const idToken = userData.idToken;
                const salt = userData.salt;
                const address = jwtToAddress(idToken, salt);
                setSuiAddress(address);
                console.log("Sui Address: ", address);
                setShowPopup(false);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        }
    }, []);

    return (
        <div>
            {suiAddress ? (
                <p className="mt-4 text-center">
                    Sui Address: {suiAddress}
                </p>
            ) : (
                <button
                    onClick={() => setShowPopup(true)}
                    className="flex items-center gap-2 bg-[#0f2130] text-[#d9e0e6] px-4 py-2 rounded-lg hover:bg-[#193247] transition"
                >
                    <Image src="/ui/sui-logo.png" width={24} height={24} alt="Sui Logo" />
                    Login
                </button>
            )}

            {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[rgba(25,50,71,0.7)] rounded-lg shadow-lg p-10 w-[400px] relative backdrop-blur-md">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-white"
                            onClick={() => setShowPopup(false)}
                        >
                            ✕
                        </button>

                        <div className="flex flex-col items-center">
                            <Image
                                src="/sgt_logo.png"
                                alt="Sui Logo"
                                width={350}
                                height={350}
                            />

                            <div className="border-t border-[rgba(255,255,255,0.9)] my-4" />

                            <GoogleOAuth />
                        </div>
                    </div>

                    {/* 배경 클릭 시 팝업 닫기 */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[-1]"
                        onClick={() => setShowPopup(false)}
                    />
                </div>
            )}
        </div>
    );
}