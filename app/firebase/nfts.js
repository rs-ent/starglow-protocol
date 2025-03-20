/// app\firebase\nfts.js

import { collection, doc, getDoc, getDocs, setDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firestore-voting';

// 모든 NFT 목록 가져오기
export async function getNFTCollections() {
    try {
        const nftCollection = collection(db, 'nfts');
        const nftQuery = query(nftCollection, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(nftQuery);

        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
    }
}

export async function getNFTsByCollection(collectionName) {
    try {
        const mintedObjectsRef = collection(db, 'nfts', collectionName, 'minted_objects');
        const mintedQuery = query(mintedObjectsRef, orderBy('timestamp', 'desc'));

        const snapshot = await getDocs(mintedQuery);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
    }
}

// 특정 NFT 가져오기 (id: objectId)
export async function getNFT(collectionName, objectId) {
    try {
        const nftRef = doc(db, 'nfts', collectionName, 'minted_objects', objectId);
        const nftSnap = await getDoc(nftRef);

        if (!nftSnap.exists()) {
            throw new Error('NFT not found');
        }

        return { id: nftSnap.id, ...nftSnap.data() };
    } catch (error) {
        console.error('Error fetching NFT:', error);
        throw error;
    }
}

export async function setCollection(collectionData) {
    try {
        const { nft, timestamp, ...formattedData } = collectionData;
        formattedData.timestamp = serverTimestamp();
        const nftCollection = collection(db, 'nfts');
        const collectionDocRef = doc(nftCollection, formattedData.name);

        await setDoc(collectionDocRef, formattedData, { merge: true });
    } catch (error) {
        console.error('Error setting NFT collection:', error);
        throw error;
    }
}

// NFT 데이터 저장하기 (민팅 후 호출)
export async function setNFTs(createdObjects = []) {
    try {
        const nftCollection = collection(db, 'nfts');

        const savePromises = createdObjects.map(async (nft) => {
            const nftDocRef = doc(nftCollection, nft.name);

            // 기본 NFT 문서
            await setDoc(nftDocRef, {
                name: nft.name,
                collection: nft.collection,
                creator: nft.creator,
                image_url: nft.image_url,
                description: nft.description,
                timestamp: serverTimestamp(),
            }, { merge: true });

            // 민팅된 NFT 객체를 subcollection에 저장
            const mintedObjectsRef = doc(nftCollection, nft.name, 'minted_objects', nft.objectId);
            const mintedNFTData = {
                ...nft,
                timestamp: serverTimestamp(),
            };

            return setDoc(mintedObjectsRef, mintedNFTData);
        });

        await Promise.all(savePromises);
    } catch (error) {
        console.error('Error setting NFTs:', error);
        throw error;
    }
}
