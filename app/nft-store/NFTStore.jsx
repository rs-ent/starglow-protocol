/// app\nft-store\NFTStore.jsx
"use client";

import { useEffect, useState } from "react";
import ZkLogin from "../components/zkLogin"

export default function NFTStore({ nfts = [] }) {

    return (
        <section className="bg-[var(--background-second)] p-4 min-h-screen">
            <div className="flex flex-col items-end justify-end">
                <ZkLogin />
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
                                    <p>
                                        Available Amount: {collection.nft.length}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="button-feather-purple w-full mb-2"
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
