/// app\sui\client-utils.js

"use client";

import suiClient from './suiClient';
import { decoding } from '../scripts/encryption';
import { jwtToAddress, getExtendedEphemeralPublicKey, getZkLoginSignature, genAddressSeed } from "@mysten/sui/zklogin";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export async function getMaxEpoch() {
    const systemState = await suiClient.getLatestSuiSystemState();
    return Number(systemState.epoch) + 5;
}

export function getUserAddressWithUserData() {
    const encodedUserData = localStorage.getItem("userData");
    const userData = encodedUserData ? JSON.parse(decoding(encodedUserData)) : null;
    const idToken = userData ? userData.idToken : null;
    const salt = userData ? userData.salt : null;
    if (!userData || !idToken || !salt) {
        return {address: {}, user: {}};
    }
    
    const address = jwtToAddress(idToken, salt);
    return {address, user: userData};
}


export async function generateZkProof(txBlock, { ephemeralPublicKey, userData, randomness, maxEpoch }) {
    if (!userData || !userData.idToken || !userData.salt) {
        console.error("User data is missing");
        return;
    }

    const { idToken, salt } = userData;
    
    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralPublicKey);

    const proverUrl = process.env.NEXT_PUBLIC_PROVER_URL || 'https://prover-dev.mystenlabs.com/v1';
    
    const postData = {
        jwt: idToken,
        extendedEphemeralPublicKey,
        maxEpoch,
        jwtRandomness: randomness,
        salt,
        keyClaimName: "sub",
    }
    const nonce = sessionStorage.getItem("nonce");
    
    let zkProofData;
    try {
        const { data } = await axios.post(
            proverUrl, 
            postData, 
            {
            headers: {
                "Content-Type": "application/json",
            },
        });
        zkProofData = data;
        console.log("ZK Proof response:", zkProofData);
    } catch (error) {
        console.error("Error fetching ZK Proof:", error);
        if (error.response) {
            console.error("Error details:", error.response.data);
        }
        return null;
    }

    return zkProofData;
}