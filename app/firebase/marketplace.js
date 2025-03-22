/// app/firebase/marketplace.js

import { collection, doc, getDoc, getDocs, updateDoc, setDoc, query, orderBy, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db } from './firestore-voting';

const timestampToString = (timestamp) => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toISOString();
    } else if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toISOString();
    }
    return null;
};

// List NFT on Marketplace
export async function listNFTOnMarketplace({
    nftCollectionId,
    salePrice,
    startDate,
    endDate,
    quantity,
    sellerWallet,
}) {
    try {
        const listings = collection(db, 'marketplace_listings');
        const listingId = `${nftCollectionId}_${Date.now()}`;

        const listingData = {
            nftCollectionId,
            salePrice,
            startDate,
            endDate,
            quantity,
            sellerWallet,
            status: 'Active',
            createdAt: serverTimestamp(),
        };

        await setDoc(doc(listings, listingId), listingData);

        return { success: true, listingId };
    } catch (error) {
        console.error('Error listing NFT on marketplace:', error);
        throw error;
    }
}

// Get all marketplace listings
export async function getMarketplaceListings() {
    try {
        const listings = collection(db, 'marketplace_listings');
        const listingsQuery = query(listings, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(listingsQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: timestampToString(doc.data().createdAt),
        }));
    } catch (error) {
        console.error('Error fetching marketplace listings:', error);
        throw error;
    }
}

// Get specific marketplace listing by ID
export async function getListing(listingId) {
    try {
        const listingRef = doc(db, 'marketplace_listings', listingId);
        const snapshot = await getDoc(listingRef);

        if (!snapshot.exists()) {
            throw new Error('Listing not found');
        }

        return {
            id: snapshot.id,
            ...snapshot.data(),
            createdAt: timestampToString(snapshot.data().createdAt),
        };
    } catch (error) {
        console.error('Error fetching listing:', error);
        throw error;
    }
}

// Update listing status
export async function updateListingStatus(listingId, status) {
    try {
        const listingRef = doc(db, 'marketplace_listings', listingId);
        await updateDoc(listingRef, { status });
    } catch (error) {
        console.error('Error updating listing status:', error);
        throw error;
    }
}

// Submit an offer for NFT
export async function submitOffer({
    listingId,
    buyerWallet,
    offerPrice,
    transactionDigest,
}) {
    try {
        const offersRef = collection(db, 'marketplace_listings', listingId, 'offers');
        const offerId = `${buyerWallet}_${Date.now()}`;

        const offerData = {
            listingId,
            buyerWallet,
            offerPrice,
            transactionDigest,
            status: 'Pending',
            createdAt: serverTimestamp(),
        };

        await setDoc(doc(offersRef, offerId), offerData);
        return { success: true, offerId };
    } catch (error) {
        console.error('Error submitting offer:', error);
        throw error;
    }
}

// Get all offers by listing ID
export async function getOffersByListing(listingId) {
    try {
        const offersRef = collection(db, 'marketplace_listings', listingId, 'offers');
        const offersQuery = query(offersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(offersQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: timestampToString(doc.data().createdAt),
        }));
    } catch (error) {
        console.error('Error fetching offers:', error);
        throw error;
    }
}

// Accept an offer
export async function acceptOffer(listingId, offerId) {
    try {
        const offerRef = doc(db, 'marketplace_listings', listingId, 'offers', offerId);
        await updateDoc(offerRef, { status: 'Accepted' });

        await updateListingStatus(listingId, 'Sold');
    } catch (error) {
        console.error('Error accepting offer:', error);
        throw error;
    }
}

// Decline an offer
export async function declineOffer(listingId, offerId) {
    try {
        const offerRef = doc(db, 'marketplace_listings', listingId, 'offers', offerId);
        await updateDoc(offerRef, { status: 'Declined' });
    } catch (error) {
        console.error('Error declining offer:', error);
        throw error;
    }
}
