"use client";

import { useState, useEffect, useRef } from "react";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { encoding } from "../scripts/encryption";
import { getMaxEpoch } from "../sui/client-utils";
import Image from "next/image";
import GoogleOAuth from "../oauth/GoogleOAuth";

export default function ZkLoginModal({ isModal = true, onClose }) {
    const [nonce, setNonce] = useState('');

    useEffect(() => {
        const createNonce = async () => {
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
        }
        createNonce();
    },[]);

    return (
        <div className="bg-[rgba(25,50,71,0.7)] rounded-lg shadow-lg p-10 w-[400px] relative backdrop-blur-md">
            {isModal && (
                <button
                    className="absolute top-2 right-3 text-gray-500 hover:text-white"
                    onClick={onClose}
                >
                    ✕
                </button>
            )}

            <div className="flex flex-col items-center">
                <Image
                    src="/sgt_logo.png"
                    alt="Sui Logo"
                    width={350}
                    height={250}
                />

                <div className="w-full border-t-[3px] border-[rgba(255,255,255,0.1)] mt-1 mb-10" />

                <GoogleOAuth nonce={nonce} />
            </div>
        </div>
    );
}
