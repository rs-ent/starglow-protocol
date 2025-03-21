/// app\sui\nft-mint.js

import suiClient from './suiClient';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
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

export async function mintNFT(formData) {
    try {
        if (!formData.amount || !formData.name || !formData.description) {
            return { success: false, message: "Please fill all the required fields" };
        }

        const creatorAddress = process.env.NFT_CREATOR_ADDRESS;
        const creatorPrivateKey = process.env.NFT_CREATOR_PRIVATE_KEY;

        if (!creatorPrivateKey) {
            return { success: false, message: "Creator private key not found" };
        }

        if (!creatorAddress) {
            return { success: false, message: "Creator address not found" };
        }

        const decodedKey = decodeSuiPrivateKey(creatorPrivateKey);
        const creatorKeypair = Ed25519Keypair.fromSecretKey(decodedKey.secretKey);

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
                tx.pure(creatorAddress),
            ],
        });

        tx.setSender(creatorAddress);

        const txBytes = await tx.build({ client: suiClient });
        const signedTx = await creatorKeypair.signTransaction(txBytes);
        const result = await suiClient.executeTransactionBlock({
            transactionBlock: txBytes,
            signature: signedTx.signature,
        });

        const txDigest = result.digest;
        await suiClient.waitForTransaction({
            digest: txDigest,
            timeout: 60000,
        });

        const txDetails = await suiClient.getTransactionBlock({
            digest: txDigest,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });

        const createdObjects = txDetails.objectChanges.filter((change) => change.type === "created");
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

                return parseNFTForFirebase(objDetail, txDigest);
            })
        );

        await setNFTs(nftDetails);

        return { success: true, result: { digest: txDigest, nftDetails } };
    } catch (error) {
        console.error("Error in mintNFT:", error);
        return { success: false, error };
    }
}