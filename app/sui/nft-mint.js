/// app\sui\nft-mint.js

import suiClient from './suiClient';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateZkProof } from './client-utils';
import { genAddressSeed, getZkLoginSignature } from '@mysten/sui/zklogin';
import { getSessionUserData } from '../scripts/user';
import { decoding } from '../scripts/encryption';

export async function mintNFT(formData) {
    try {

        const ephemeralSecret = decoding(sessionStorage.getItem("ephemeralSecret"));
        const ephemeralKeypair = Ed25519Keypair.fromSecretKey(ephemeralSecret);
        const ephemeralPublicKey = ephemeralKeypair.getPublicKey();

        const userData = await getSessionUserData();
        const loginAddress = userData.suiAddress;
        if (!loginAddress) {
            console.error("Could not get sui address");
            return;
        }

        if (!userData) {
            console.error("User data is missing");
            return;
        }       

        const randomness = sessionStorage.getItem("randomness");
        const maxEpoch = sessionStorage.getItem("maxEpoch");

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

        const zkProof = await generateZkProof(txBlock, {
            ephemeralPublicKey,
            userData,
            randomness,
            maxEpoch,
        });
        if (!zkProof) {
            console.error("Failed to generate zk proof signature");
            return;
        }
        console.log("ZK Proof:", zkProof);

        const { bytes, signature: userSignature } = await tx.sign({
            client: suiClient,
            signer: ephemeralKeypair,
        });

        const addressSeed = genAddressSeed(
            BigInt(userData.salt),
            "sub",
            userData.sub,
            userData.aud
        ).toString();

        const zkLoginSignature = getZkLoginSignature({
            inputs: {
                ...zkProof,
                addressSeed,
            },
            maxEpoch,
            userSignature,
        });

        const result = await suiClient.executeTransactionBlock({
            transactionBlock: bytes,
            signature: zkLoginSignature,
        });

        console.log("Mint NFT result:", result);
        return result;
    } catch (error) {
        console.error("Failed to mint NFT:", error);
        throw error;
    }
}