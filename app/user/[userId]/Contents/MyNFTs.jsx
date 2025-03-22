/// app\user\[userId]\Contents\MyNFTs.jsx

"use client";

import { useState } from "react";
import { listNFTOnMarketplace } from "../../../firebase/marketplace";
import toaster from "../../../toaster/toast";

export default function MyNFTs({ userData = {}, nfts = [] }) {

    const [isListing, setIsListing] = useState(false);
    const [listingCollection, setListingCollection] = useState(null);
    const [showListingModal, setShowListingModal] = useState(false);

    const [salePrice, setSalePrice] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
    const [listingQuantity, setListingQuantity] = useState(1);


    const handleListing = (collection) => {
        setIsListing(true);
        setShowListingModal(true);
        setListingCollection(collection);
    }

    const handleListingModalClose = () => {
        setShowListingModal(false);
        setIsListing(false);
        setListingCollection(null);
    }

    const handleSubmitListing = async () => {
        if (!salePrice || !startDate || !endDate || !listingQuantity) {
            toaster({
                message: "Please fill out all fields.",
                type: "error",
            });
            return;
        }

        try {
            const result = await listNFTOnMarketplace({
                nftCollectionId: listingCollection.id,
                salePrice: Number(salePrice),
                startDate,
                endDate,
                quantity: listingQuantity,
                sellerWallet: userData.suiAddress,
            });

            if (result.success) {
                toaster({
                    message: "Your NFT has been successfully listed!",
                    type: "success",
                });
                handleListingModalClose();
            }
        } catch (error) {
            console.error("Listing failed:", error);
            toaster({
                message: "Failed to list NFT. Please try again later.",
                type: "error",
            });
        }
    };

    return (
        <div className="flex flex-wrap justify-center">
            {showListingModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center"
                    onClick={() => handleListingModalClose()}
                >
                    <div
                        className="bg-gradient-to-br from-[rgba(15,10,30,1)] to-[rgba(0,0,0,0.9)] rounded-xl p-6 border border-[rgba(255,255,255,0.3)] shadow-xl w-full max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-3xl font-main-bold text-center text-glow-strong mb-4">
                            List NFT for Sale
                        </h3>
                        <div className="border-t border-[rgba(255,255,255,0.2)] mb-4" />

                        <div className="flex flex-col items-center gap-3 mb-4">
                            <h3 className="text-2xl text-glow-strong">{listingCollection.name}</h3>
                            <p className="text-sm text-[rgba(255,255,255,0.7)] text-center">
                                {listingCollection.description}
                            </p>
                            <img
                                src={listingCollection.image_url}
                                alt={listingCollection.name}
                                className="w-40 rounded-lg my-3 shadow-lg"
                            />
                            <h3 className="font-main mb-6">Owned Quantity: {listingCollection.nft.length.toLocaleString()}</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-main">Sale Price (in SUI):</label>
                                <input
                                    type="number"
                                    placeholder="Enter your price"
                                    className="w-full rounded-md px-3 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white focus:border-[rgba(255,255,255,0.5)]"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-sm font-main">Start Date:</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-md px-3 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white focus:border-[rgba(255,255,255,0.5)]"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-main">End Date:</label>
                                    <input
                                        type="date"
                                        className="w-full rounded-md px-3 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white focus:border-[rgba(255,255,255,0.5)]"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-main">Quantity to List:</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={listingCollection.nft.length}
                                    placeholder={`Max: ${listingCollection.nft.length}`}
                                    className="w-full rounded-md px-3 py-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white focus:border-[rgba(255,255,255,0.5)]"
                                    value={listingQuantity}
                                    onChange={(e) => {
                                        const qty = Math.min(
                                            Math.max(1, parseInt(e.target.value, 10) || 1),
                                            listingCollection.nft.length
                                        );
                                        setListingQuantity(qty);
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmitListing}
                            className="button-feather-purple w-full mt-5"
                        >
                            List NFT
                        </button>

                        <button
                            onClick={() => handleListingModalClose()}
                            className="font-main text-sm w-full mt-3 text-[rgba(255,255,255,0.8)] hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {nfts.map((collection, index) => (
                <div key={index} className="flex items-center justify-center p-2 shadow-sm">
                    <div>
                        <div className="bg-gradient-to-br from-[rgba(255,255,255,0.7)] to-[rgba(0,0,0,0.7)] rounded-md p-[1px]">
                            <div className="flex flex-col gap-2 items-center justify-center p-3 bg-gradient-to-br from-[rgba(20,5,40,1.0)] to-[rgba(5,0,10,1.0)] rounded-md">
                                <img
                                    src={collection.image_url}
                                    alt={collection.name}
                                    className="w-[350px] rounded-md mb-3"
                                />
                                <h3 className="text-5xl text-glow-strong">
                                    {collection.name}
                                </h3>
                                <p className="text-xs text-[rgba(255,255,255,0.7)]">
                                    {collection.description}
                                </p>
                                <div className="w-full border-t border-t-[rgba(255,255,255,0.2)] my-3" />
                                <h3>
                                    Quantity : {collection.nft.length.toLocaleString()}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={() => handleListing(collection)}
                            disabled={isListing}
                            className="font-main text-base w-full mt-4 border border-[rgba(255,255,255,0.8)] rounded-md py-2 hover:bg-[rgba(255,255,255,0.1)] transition-all"
                        >
                            List for Sale
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};