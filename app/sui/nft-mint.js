/// app\sui\nft-mint.js

import suiClient from './suiClient';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateZkProof, generateZkProofWithShinami } from './utils';
import { genAddressSeed, getZkLoginSignature } from '@mysten/sui/zklogin';
import { getSessionUserData } from '../scripts/user/user';
import { decoding } from '../scripts/encryption';
import { jwtDecode } from "jwt-decode";
import { setNFTs } from '../firebase/nfts';

export function parseNFTForFirebase(nftData, digest) {
    const { data } = nftData;

    const {
        objectId,
        version,
        digest: objectDigest,
        type,
        owner,
        content,
        display,
    } = data;

    const fields = content?.fields || {};
    const ownerAddress = owner?.AddressOwner || owner?.ObjectOwner || owner?.Shared || null;

    return {
        objectId,
        version,
        objectDigest,
        transactionDigest: digest,
        type,
        owner: ownerAddress,
        name: fields.name || '',
        description: fields.description || '',
        collection: fields.collection || '',
        creator: fields.creator || '',
        created_at: Number(fields.created_at) || null,
        external_link: fields.external_link || '',
        image_url: fields.image_url || '',
        report_url: fields.report_url || '',
        share_percent: Number(fields.share_percent) || 0,
        glow_start: Number(fields.glow_start) || null,
        glow_end: Number(fields.glow_end) || null,
        display_data: display?.data || null,
        display_error: display?.error || null,
        nested_id: fields.id?.id || null,
        hasPublicTransfer: content?.hasPublicTransfer || false,
    };
}

export async function mintNFT(formData, userData = {}) {
    try {
        if (!formData.amount || !formData.name || !formData.description) {
            return { success: false, error: "Missing required NFT details" };
        }

        if (!userData || !userData.allowMinting) {
            console.log("User data not provided, fetching from session");
            userData = await getSessionUserData();
            if (!userData) {
                console.error("User data is missing");
                return { success: false, error: "User data is missing" };
            }
        } else {
            console.log("User data provided");
        }

        const loginAddress = userData.suiAddress;
        if (!loginAddress) {
            console.error("Could not get Sui address");
            return { success: false, error: "Could not retrieve Sui address" };
        }

        if (userData.allowMinting !== true) {
            return { success: false, error: "User is not allowed to mint NFTs" };
        }

        const ephemeralSecret = decoding(sessionStorage.getItem("ephemeralSecret"));
        if (!ephemeralSecret) {
            return { success: false, error: "For security reasons, please log out and log back in." };
        }
        const ephemeralKeypair = Ed25519Keypair.fromSecretKey(ephemeralSecret);
        const ephemeralPublicKey = ephemeralKeypair.getPublicKey();

        const randomness = sessionStorage.getItem("randomness");
        const maxEpoch = sessionStorage.getItem("maxEpoch");
        if (!randomness || !maxEpoch) {
            console.error("Session data missing");
            return { success: false, error: "Session expired or invalid, please log in again." };
        }

        const tx = new TransactionBlock();
        const contractAddress = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS;
        const moduleName = "collection";
        const functionName = "batch_mint_nft";

        tx.moveCall({
            target: `${contractAddress}::${moduleName}::${functionName}`,
            arguments: [
                tx.pure(Number(formData.amount)),
                tx.pure("Starglow NFT"),
                tx.pure(formData.name),
                tx.pure(formData.description),
                tx.pure(formData.image_url),
                tx.pure(formData.report_url),
                tx.pure(formData.external_url),
                tx.pure(Number(formData.share_percent)),
                tx.pure(Date.parse(formData.glow_start)),
                tx.pure(Date.parse(formData.glow_end)),
                tx.pure(loginAddress),
            ],
        });
        tx.setSender(loginAddress);

        const txBytes = await tx.build({ client: suiClient });
        const txBlock = { bytes: txBytes };

        const proofResponse = await fetch('/api/sui/shinami/zkProof', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ephemeralPublicKey: ephemeralPublicKey,
                userData,
                randomness,
                maxEpoch,
            }),
        });
        
        const proofJson = await proofResponse.json();
        if (!proofResponse.ok || !proofJson.success) {
            console.error("zkProof generation failed:", proofJson.error);
            return { success: false, error: proofJson.error || "zkProof generation failed" };
        }
        
        const zkProof = proofJson.zkProof;
        if (!zkProof) {
            console.error("Failed to generate zk proof signature");
            return { success: false, error: "Failed to generate cryptographic proof. Please retry." };
        }

        const signResult = await ephemeralKeypair.signTransaction(txBytes);
        const base64Signature = signResult.signature;

        const decodedJwt = jwtDecode(userData.idToken);
        const addressSeed = genAddressSeed(
            BigInt(userData.salt),
            "sub",
            decodedJwt.sub,
            decodedJwt.aud
        ).toString();

        const zkLoginSignature = getZkLoginSignature({
            inputs: {
                ...zkProof,
                addressSeed,
            },
            maxEpoch,
            userSignature: base64Signature,
        });

        const result = await suiClient.executeTransactionBlock({
            transactionBlock: txBytes,
            signature: zkLoginSignature,
        });

        const txDigest = result.digest;
        const txDetails = await suiClient.getTransactionBlock({
            digest: txDigest,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });
        console.log("txDetails:", txDetails);

        const createdObjects = txDetails.objectChanges.filter((change) => change.type === "created");
        console.log("Created objects:", createdObjects);
        const nftDetails = await Promise.all(
            createdObjects.map(async (obj) => {
                const objDetail = await suiClient.getObject({
                    id: obj.objectId,
                    options: {
                        showType: true,
                        showContent: true,
                        showDisplay: true,
                        showOwner: true,
                    },
                });
                console.log("Object detail:", objDetail);

                return parseNFTForFirebase(objDetail, txDigest);
            })
        );
        console.log("NFT details:", nftDetails);
        const savedData = await setNFTs(nftDetails);
        console.log("Saved NFTs to Firebase:", savedData);

        return { success: true, result: { digest: txDigest, nftDetails } };
    } catch (error) {
        console.error("Failed to mint NFT:", error);
        return { success: false, error: error.message || "Unexpected error occurred" };
    }
}