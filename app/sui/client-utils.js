/// app\sui\client-utils.js

"use client";

import suiClient from './suiClient';
import { getExtendedEphemeralPublicKey } from "@mysten/sui/zklogin";
import axios from 'axios';

export async function getMaxEpoch() {
    const systemState = await suiClient.getLatestSuiSystemState();
    return Number(systemState.epoch) + 5;
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

export async function generateZkProofWithShinami(txBlock, { ephemeralPublicKey, userData, randomness, maxEpoch }) {
    const shinamiProverUrl = process.env.NEXT_PUBLIC_SHINAMI_PROVER_URL || 'https://api.shinami.com/sui/zklogin/v1/zkp';
    const shinamiApiKey = process.env.NEXT_PUBLIC_SHINAMI_API_KEY;

    if (!userData || !userData.idToken || !userData.salt) {
        console.error("User data is missing");
        return null;
    }

    const { idToken, salt } = userData;

    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralPublicKey);

    const postData = {
        jwt: idToken,
        extendedEphemeralPublicKey,
        maxEpoch,
        jwtRandomness: randomness,
        salt,
        keyClaimName: "sub",
    };

    try {
        const { data } = await axios.post(
            shinamiProverUrl,
            postData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": shinamiApiKey,
                },
            }
        );

        console.log("Shinami ZK Proof response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching Shinami ZK Proof:", error);
        if (error.response) {
            console.error("Error details:", error.response.data);
        }
        return null;
    }
}