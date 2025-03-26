// app\nft-store\admin\NFTAdmin.jsx

"use client";

import { useEffect, useState } from "react";
import { setCollection } from "../../firebase/nfts";
import { krw_usd } from "../../scripts/exchange";
import ZkLogin from "../../components/zkLogin";

export default function NFTAdmin({ collections = [] }) {
    const [nftData, setNftData] = useState(collections);
    const [allowEdit, setAllowEdit] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(1);

    useEffect(() => {
        krw_usd().then((rate) => {
            if (rate) {
                setExchangeRate(rate);
            }
        });
    }, []);

    const handleLogin = (data) => {
        setAllowEdit(data.allowMinting || false);
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
                            <div className="flex gap-4 mb-4">
                                <img src={collection.image_url} className="w-auto h-auto max-w-28 rounded-md" />
                                <div>
                                    <h3 className="text-4xl text-glow-strong">{collection.name}</h3>
                                    <p className="text-[rgba(255,255,255,0.5)]">{collection.description}</p>
                                    <p className="text-[rgba(255,255,255,0.5)]">
                                        Glow Period: {new Date(collection.glow_start).toLocaleString().split(',')[0]} ~ {new Date(collection.glow_end).toLocaleString().split(',')[0]}
                                    </p>
                                    <div>
                                        <a
                                            href={collection.report_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[rgba(255,255,255,0.5)] hover:underline cursor-pointer"
                                        >
                                            {collection.report_url}
                                        </a>
                                    </div>

                                    <div>
                                        <a
                                            href={collection.external_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[rgba(255,255,255,0.5)] hover:underline cursor-pointer"
                                        >
                                            {collection.external_link}
                                        </a>
                                    </div>

                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 justify-start items-start">
                                <div className="flex gap-4 items-start">
                                    <div>
                                        <label className="text-sm block">Price (USD $)</label>
                                        <input
                                            type="number"
                                            className="rounded px-2 py-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)]"
                                            value={collection.price || 0}
                                            onChange={(e) => handleUpdate(index, "price", parseFloat(e.target.value))}
                                        />
                                        <div className="grid grid-cols-2 gap-4 justify-between my-3 text-xs text-center">
                                            <p className="border border-[rgba(255,255,255,0.2)] p-1 rounded-md">
                                                {parseInt(collection.price / exchangeRate, 10).toLocaleString() || 0} ￦
                                            </p>
                                            <p className="border border-[rgba(255,255,255,0.2)] p-1 rounded-md">
                                                {parseInt(collection.price, 10).toLocaleString() || 0} ＄
                                            </p>
                                        </div>
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
                                        <span className="text-lg ml-2">/ {collection.nft.length}</span>
                                    </div>
                                </div>

                                <div>
                                    <button className="border border-[rgba(255,255,255,0.2)] p-2 rounded-md">
                                        MAKE PROMO CODE
                                    </button>
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
