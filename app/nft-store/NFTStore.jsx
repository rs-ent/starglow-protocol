/// app\nft-store\NFTStore.jsx

"use client";

import { useState } from "react";
import ZkLogin from "../components/zkLogin"
import Payments from "../components/Payments/Payments";

export default function NFTStore({ nfts = [] }) {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState(null);
    const [showPaymentModule, setShowPaymentModule] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const handleLoginUserData = (data) => {
        setUserData(data);
    };

    const handleFormData = (data) => {
        setFormData({ ...data, quantity: selectedQuantity });
        setShowPaymentModule(true);
    };

    return (
        <section className="bg-[var(--background-second)] p-4 min-h-screen">
            {showPaymentModule && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50 backdrop-blur-sm"
                    onClick={() => setShowPaymentModule(false)}
                >
                    <div className="bg-[rgba(3,0,10,1)] p-4 rounded-md items-center justify-center">
                        <Payments userData={userData} formData={formData} />
                    </div>
                </div>
            )}
            <div className="flex flex-col items-end justify-end">
                <ZkLogin forceToLogin={false} onLoginUserData={handleLoginUserData} />
            </div>
            <h2 className="section-title font-main-bold text-glow-strong">
                NFT
            </h2>

            <div>
                {nfts.map((collection, index) => (
                    <div key={index} className="flex items-center justify-center p-2">
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
                                    <div className="flex justify-between gap-2">
                                        <p>
                                            Price: {(collection.price || 1000).toLocaleString()} ￦
                                        </p>
                                        <p> | </p>
                                        <p>
                                            Available Amount: {collection.availableAmount || collection.nft.length}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center justify-center mt-2">
                                <label className="text-sm">Quantity:</label>
                                <input
                                    type="number"
                                    className="rounded px-2 py-1 w-20 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]"
                                    min={1}
                                    max={collection.availableAmount || collection.nft.length}
                                    value={selectedQuantity}
                                    onChange={(e) => {
                                        const qty = Math.min(
                                            Math.max(1, parseInt(e.target.value, 10)),
                                            collection.availableAmount || collection.nft.length
                                        );
                                        setSelectedQuantity(qty);
                                    }}
                                />
                            </div>

                            <h1 className="text-center mt-2">Total Price : {((collection.price || 1000) * selectedQuantity).toLocaleString()}</h1>

                            <button
                                className="button-feather-purple w-full mb-2"
                                onClick={() => handleFormData(collection)}
                            >
                                Buy NFT
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
