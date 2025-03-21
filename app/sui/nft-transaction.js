/// app\sui\nft-transaction.js

import { getPaymentByOid } from '../firebase/payment';
import { getUserDataByDocId } from '../firebase/user-data';
import { getNFTCollection, updateNFT } from '../firebase/nfts';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import suiClient from './suiClient';

export async function TransferNFT(oid = "") {
    try {
        const paymentDetail = await getPaymentByOid(oid);
        if (!paymentDetail) throw new Error('Payment details not found');

        const userData = await getUserDataByDocId(paymentDetail.buyerId);
        if (!userData || !userData.suiAddress) throw new Error('User data not found');

        const collection = await getNFTCollection(paymentDetail.productId);
        if (!collection || !collection.nft.length) throw new Error('NFT collection not available');

        const tx = new TransactionBlock();
        const contractAddress = process.env.NEXT_PUBLIC_SMART_CONTRACT_ADDRESS;
        const creatorAddress = process.env.NFT_CREATOR_ADDRESS;

        const creatorOwnedNFTs = collection.nft.filter(nft => nft.owner === creatorAddress);
        const onChainValidatedNFTs = [];
        for (const nft of creatorOwnedNFTs) {
            const objectDetails = await suiClient.getObject({
                id: nft.objectId,
                options: { showOwner: true },
            });

            const ownerAddress = objectDetails?.data?.owner?.AddressOwner;

            if (ownerAddress && ownerAddress === creatorAddress) {
                onChainValidatedNFTs.push(nft);
            }
        }

        if (onChainValidatedNFTs.length < paymentDetail.quantity) {
            throw new Error("Not enough creator-owned NFTs available for transfer.");
        }

        const nftsToTransfer = onChainValidatedNFTs.slice(0, paymentDetail.quantity);
        for (const nft of nftsToTransfer) {
            tx.moveCall({
                target: `${contractAddress}::collection::transfer`,
                arguments: [
                    tx.object(nft.objectId),
                    tx.pure(userData.suiAddress),
                ],
            });

            nft.owner = userData.suiAddress;
            await updateNFT(collection.id, nft.id, { owner: userData.suiAddress });
        }

        tx.setSender(creatorAddress);
        const txBytes = await tx.build({ client: suiClient });

        const creatorPrivateKey = process.env.CREATOR_PRIVATE_KEY;
        const decodedKey = decodeSuiPrivateKey(creatorPrivateKey);
        const creatorKeypair = Ed25519Keypair.fromSecretKey(decodedKey.secretKey);
        const signedTx = await creatorKeypair.signTransaction(txBytes);

        const result = await suiClient.executeTransactionBlock({
            transactionBlock: txBytes,
            signature: signedTx.signature, // creator의 서명 사용
        });

        console.log("Transaction success:", result);
        return { success: true, transactionDigest: result.digest };
    } catch (error) {
        console.error("Error in TransactionNFT:", error);
        return { success: false, error: error.message };
    }
}