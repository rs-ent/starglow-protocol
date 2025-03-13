/// app\components\zkLogin.jsx

"use client";

import { useState, useEffect } from "react";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { getUserAddress, getMaxEpoch } from "../sui/client-utils";
import { encoding } from "../scripts/encryption";
import Image from 'next/image';
import GoogleOAuth from "../oauth/GoogleOAuth";

export default function ZkLogin() {
    const [suiAddress, setSuiAddress] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [nonce, setNonce] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginClick = async () => {
        setLoading(true);
        try {
            const ephemeralKeypair = new Ed25519Keypair();
            console.log("ephemeralKeypair:", ephemeralKeypair);
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

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "userData") {
                const address = getUserAddress();
                console.log("Address: ", address);
                if (address) {
                    setSuiAddress(address);
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
                <p className="mt-4 text-center">
                    Sui Address: {suiAddress}
                </p>
            ) : (
                <button
                    onClick={() => {
                        setShowPopup(true);
                        handleLoginClick();
                    }}
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
                                height={350}
                            />

                            <div className="border-t border-[rgba(255,255,255,0.9)] my-4" />

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