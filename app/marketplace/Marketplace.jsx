/// app\marketplace\Marketplace.jsx

"use client";

import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { getMarketplaceListings } from "../firebase/marketplace";

export default function Marketplace({ initialListings = [] }) {
    const [listings, setListings] = useState(initialListings);
    const [loading, setLoading] = useState(false);

    const refreshListings = async () => {
        setLoading(true);
        try {
            const data = await getMarketplaceListings();
            setListings(data);
        } catch (error) {
            console.error("Error refreshing listings:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
            <h1 className="text-4xl font-main-bold text-center text-glow-strong mb-8">Marketplace</h1>

            <div className="flex justify-center mb-4">
                <button className="button-base" onClick={refreshListings}>
                    Refresh Listings
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <div
                        key={listing.id}
                        className="bg-gradient-to-br from-[rgba(20,10,40,1)] to-[rgba(0,0,0,0.9)] p-5 rounded-lg border border-[rgba(255,255,255,0.2)] shadow-lg"
                    >
                        <h2 className="text-2xl font-main text-glow mb-2">
                            Collection: {listing.nftCollectionId}
                        </h2>
                        <p className="text-[rgba(255,255,255,0.7)]">
                            Price: {listing.salePrice} SUI
                        </p>
                        <p className="text-[rgba(255,255,255,0.7)]">
                            Quantity: {listing.quantity}
                        </p>
                        <p className="text-sm text-[rgba(255,255,255,0.5)] mt-2">
                            Listed by: {listing.sellerWallet.slice(0, 6)}...
                            {listing.sellerWallet.slice(-4)}
                        </p>
                        <p className="text-sm text-[rgba(255,255,255,0.5)] mt-1">
                            Status: {listing.status}
                        </p>
                        <button
                            className="button-feather-purple w-full mt-4"
                            onClick={() => handleSelectNFT(listing)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}