/// app\firebase\nfts.js

import { collection, doc, getDoc, getDocs, updateDoc, setDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firestore-voting';

const timestampToString = (timestamp) => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toISOString();
    } else if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toISOString();
    }
    return null;
};

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

export async function getNFTCollection(collectionId) {
    try {
        const nftCollection = collection(db, 'nfts');
        const nftDocRef = doc(nftCollection, collectionId);
        const nftDocSnap = await getDoc(nftDocRef);

        if (!nftDocSnap.exists()) {
            throw new Error('NFT collection not found');
        }

        const nft = await getNFTsByCollection(collectionId);
        return { id: nftDocSnap.id, ...nftDocSnap.data(), nft };
    } catch (error) {
        console.error('Error fetching NFT collection:', error);
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

// NFT 데이터 업데이트하기 (소유자 변경)
export async function updateNFT(collectionName, objectId, updateData) {
    try {
        const nftRef = doc(db, 'nfts', collectionName, 'minted_objects', objectId);
        await updateDoc(nftRef, updateData);
    } catch (error) {
        console.error('Error updating NFT:', error);
        throw error;
    }
}

export async function getMyNFTs(suiAddress) {
    try {
        const nftCollectionRef = collection(db, 'nfts');
        const collectionsSnapshot = await getDocs(nftCollectionRef);

        const myCollections = await Promise.all(collectionsSnapshot.docs.map(async (collectionDoc) => {
            const collectionData = collectionDoc.data();

            const mintedObjectsRef = collection(db, 'nfts', collectionDoc.id, 'minted_objects');
            const ownedQuery = query(mintedObjectsRef, orderBy('timestamp', 'desc'));
            const mintedSnapshot = await getDocs(ownedQuery);

            const ownedNFTs = mintedSnapshot.docs
                .filter(doc => doc.data().owner === suiAddress)
                .map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        timestamp: timestampToString(data.timestamp),
                    };
                });

            return {
                id: collectionDoc.id,
                ...collectionData,
                timestamp: timestampToString(collectionData.timestamp),
                nft: ownedNFTs
            };
        }));

        return myCollections.filter(collection => collection.nft.length > 0);
    } catch (error) {
        console.error('Error fetching my NFTs:', error);
        throw error;
    }
}