/// app\sui\utils.js

import suiClient from './suiClient';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
import { getExtendedEphemeralPublicKey } from "@mysten/sui/zklogin";
import axios from 'axios';

export async function getMaxEpoch() {
    const systemState = await suiClient.getLatestSuiSystemState();
    return Number(systemState.epoch) + 5;
}

export async function generateZkProofWithShinami(ephemeralPublicKeyBase64, userData, randomness, maxEpoch) {
    const shinamiProverUrl = process.env.SHINAMI_PROVER_URL || 'https://api.shinami.com/sui/zkprover/v1';
    const shinamiApiKey = process.env.SHINAMI_API_KEY;

    if (!userData || !userData.idToken || !userData.salt) {
        console.error("User data is missing");
        return null;
    }

    const { idToken, salt } = userData;

    const ephemeralPubKeyInstance = new Ed25519PublicKey(Buffer.from(ephemeralPublicKeyBase64, 'base64'));
    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralPubKeyInstance);
    console.log("Extended ephemeral public key:", extendedEphemeralPublicKey);
    console.log("Shinam Prover URL:", shinamiProverUrl);

    try {
        const { data } = await axios.post(shinamiProverUrl, {
            jsonrpc: "2.0",
            method: "shinami_zkp_createZkLoginProof",
            params: {
                jwt: idToken,
                maxEpoch,
                extendedEphemeralPublicKey,
                randomness,
                salt
            },
            id: 1,
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": shinamiApiKey,
            },
        });

        console.log("Shinami ZK Proof response:", data);
        return data.result;
    } catch (error) {
        console.error("Error fetching Shinami ZK Proof:", error);
        if (error.response) {
            console.error("Error details:", error.response.data);
        }
        return null;
    }
}