/// app\components\zkLogin.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { getUserAddressWithUserData, getMaxEpoch } from "../sui/client-utils";
import { encoding } from "../scripts/encryption";
import { LogIn, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import GoogleOAuth from "../oauth/GoogleOAuth";

export default function ZkLogin() {
    const [suiAddress, setSuiAddress] = useState(null);
    const [userData, setUserData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [nonce, setNonce] = useState('');
    const [loading, setLoading] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLoginClick = async () => {
        setLoading(true);
        try {
            const ephemeralKeypair = new Ed25519Keypair();
            const ephemeralPublicKey = ephemeralKeypair.getPublicKey();
            const ephemeralSecretKey = ephemeralKeypair.getSecretKey();
            const randomness = generateRandomness();
            const maxEpoch = await getMaxEpoch();
            const generatedNonce = generateNonce(ephemeralPublicKey, maxEpoch, randomness);

            sessionStorage.setItem('ephemeralSecret', encoding(ephemeralSecretKey));
            sessionStorage.setItem("randomness", randomness);
            sessionStorage.setItem("maxEpoch", maxEpoch);
            sessionStorage.setItem("nonce", generatedNonce);

            setNonce(generatedNonce);
        } catch (error) {
            console.error("Error while generating nonce: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setSuiAddress(null);
        setUserData({});
        sessionStorage.clear();
        setMenuOpen(false);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        const { address, user } = getUserAddressWithUserData();
        if (address && user) {
            setSuiAddress(address);
            setUserData(user);
        }

        const handleStorageChange = (event) => {
            if (event.key === "userData") {
                const { address, user } = getUserAddressWithUserData();
                console.log("User data: ", user);
                if (address) {
                    setSuiAddress(address);
                    setUserData(user);
                    setShowPopup(false);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div>
            {suiAddress ? (
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
                        <div className="absolute w-[200px] left-0 mt-2 w-36 bg-[#193247] text-[#d9e0e6] rounded-[1.0rem] shadow-lg z-50 p-2">
                            <button
                                className="w-full px-3 py-2 flex items-center gap-3 hover:bg-[#2a4054] rounded-[0.8rem]"
                                onClick={() => {
                                    setMenuOpen(false);
                                    // Setting 클릭 시 처리할 로직 추가
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
                        handleLoginClick();
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
                    <div className="bg-[rgba(25,50,71,0.7)] rounded-lg shadow-lg p-10 w-[400px] relative backdrop-blur-md">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-white"
                            onClick={() => {
                                setShowPopup(false);
                                sessionStorage.removeItem("nonce");
                            }}
                        >
                            ✕
                        </button>

                        <div className="flex flex-col items-center">
                            <Image
                                src="/sgt_logo.png"
                                alt="Sui Logo"
                                width={350}
                                height={250}
                            />

                            <div className="w-full border-t border-t-[3px] border-[rgba(255,255,255,0.1)] mt-1 mb-10" />

                            <GoogleOAuth nonce={nonce} />
                        </div>
                    </div>

                    {/* 배경 클릭 시 팝업 닫기 */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[-1]"
                        onClick={() => {
                            setShowPopup(false);
                            sessionStorage.removeItem("nonce");
                        }}
                    />
                </div>
            )}
        </div>
    );
}