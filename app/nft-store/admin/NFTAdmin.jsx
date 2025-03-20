// app\nft-store\admin\NFTAdmin.jsx

"use client";

import { useState } from "react";
import { setCollection } from "../../firebase/nfts";
import ZkLogin from "../../components/zkLogin";

export default function NFTAdmin({ collections = [] }) {
    const [nftData, setNftData] = useState(collections);
    const [userData, setUserData] = useState(null);
    const [allowEdit, setAllowEdit] = useState(false);

    const handleLogin = (data) => {
        setUserData(data);
        setAllowEdit(data.allowMinting);
    }

    const handleUpdate = (index, field, value) => {
        const updatedNfts = [...nftData];

        if (field === "availableAmount") {
            const maxAvailable = collections[index].nft.length;
            value = Math.min(value, maxAvailable);
        }

        updatedNfts[index][field] = value;
        setNftData(updatedNfts);
    };

    const handleSave = async () => {
        try {
            await Promise.all(
                nftData.map(async (collection) => {
                    await setCollection(collection);
                })
            );
            alert('Successfully saved!');
        } catch (error) {
            alert('Failed to save: ' + error.message);
            console.error(error);
        }
    };

    return (
        <section className="bg-[var(--background-second)] p-4 min-h-screen">
            <div>
                <h2 className="section-title font-main-bold text-glow-strong">
                    NFT Admin Panel
                </h2>
                <ZkLogin forceToLogin={true} onLoginUserData={handleLogin} />
            </div>

            {allowEdit && (
                <div>
                    {nftData.map((collection, index) => (
                        <div key={index} className="p-3 my-3 bg-[rgba(3,0,10,1)] rounded-md">
                            <h3 className="text-xl text-glow-strong mb-2">{collection.name}</h3>

                            <div className="flex gap-4 items-center">
                                <div>
                                    <label className="text-sm block">Price (Won)</label>
                                    <input
                                        type="number"
                                        className="rounded px-2 py-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]"
                                        value={collection.price || 0}
                                        onChange={(e) => handleUpdate(index, "price", parseFloat(e.target.value))}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm block">Available Amount</label>
                                    <input
                                        type="number"
                                        className="rounded px-2 py-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]"
                                        value={collection.availableAmount || collection.nft.length}
                                        onChange={(e) => handleUpdate(index, "availableAmount", parseInt(e.target.value, 10))}
                                        max={collection.nft.length}
                                    />
                                    <span className="text-xs ml-2">/ {collection.nft.length}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        className="button-feather-purple mt-4"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </section>
    );
}
