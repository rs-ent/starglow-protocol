/// app\components\zkLogin.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import { LogIn, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSessionUserData, getEncryptedLocalUserData, logout } from "../scripts/user/user";
import ZkLoginModal from "./zkLoginModal";

export default function ZkLogin({ forceToLogin = false, onLoginUserData}) {
    const router = useRouter();
    const [suiAddress, setSuiAddress] = useState(null);
    const [userData, setUserData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [nonce, setNonce] = useState('');
    const [loading, setLoading] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = async () => {
        const res = await logout();
        if (res) {
            setSuiAddress(null);
            setUserData({});
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        const checkInitialUserData = async () => {
            const user = await getSessionUserData();
            if (user) {
                setSuiAddress(user.suiAddress);
                setUserData(user);
                onLoginUserData?.(user);
            }
        }
        if (!forceToLogin) {
            checkInitialUserData();
        }

        const handleStorageChange = async (event) => {
            if (event.key === "userData") {
                const user = await getEncryptedLocalUserData();
                const suiAddress = user.suiAddress;
                if (suiAddress) {
                    setSuiAddress(suiAddress);
                    setUserData(user);
                    setShowPopup(false);
                    onLoginUserData?.(user);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [forceToLogin]);

    return (
        <div>
            {suiAddress && userData?.name ? (
                <div className="relative inline-block" ref={menuRef}>
                    <div
                        className="flex items-center gap-2 px-2 py-2 rounded-xl w-[200px]
                        bg-gradient-to-r from-[#0f2130] to-[#193247] text-[#d9e0e6] font-medium shadow-md
                        hover:shadow-lg hover:brightness-110 active:scale-95 transition-transform duration-150"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        <img
                            src={userData.picture || '/default-avatar.jpg'}
                            alt="Profile"
                            className="rounded-full w-8 h-8 shadow-sm"
                        />
                        <p className="text-sm font-bold truncate">
                            {userData.name || "Unnamed User"}
                        </p>
                    </div>

                    {menuOpen && (
                        <div className="absolute w-[200px] left-0 mt-2 bg-[#193247] text-[#d9e0e6] rounded-[1.0rem] shadow-lg z-50 p-2">
                            <button
                                className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#2a4054] rounded-[0.8rem]"
                                onClick={() => {
                                    setMenuOpen(false);
                                    router.push(`/user`);
                                }}
                            >
                                <Settings size={16} />
                                <span>Settings</span>
                            </button>
                            <button
                                className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#2a4054] rounded-[0.8rem]"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => {
                        setShowPopup(true);
                    }}
                    className="
                        flex items-center gap-2 px-5 py-2 rounded-xl
                        bg-gradient-to-r from-[#0f2130] to-[#193247] text-[#d9e0e6] font-medium shadow-md
                        hover:shadow-lg hover:brightness-110 active:scale-95 transition-transform duration-150
                    "
                >
                    <LogIn size={20} strokeWidth={2} />
                    <span>Login</span>
                </button>
            )}

            {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <ZkLoginModal
                        isModal={true}
                        onClose={() => {
                            setShowPopup(false);
                        }}
                    />

                    {/* 배경 클릭 시 팝업 닫기 */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[-1]"
                        onClick={() => {
                            setShowPopup(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}