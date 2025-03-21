/// app\nft\mint\NFTMinting.jsx

"use client"

import { useState } from "react";
import ImageUploader from "../../../components/ImageUploader";
import toaster from "../../../toaster/toast";
import ZkLogin from "../../../components/zkLogin";

export default function NFTMinting({ userData }) {
    const [updatedUserData, setUpdatedUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: "KNK NFT",
        description: "Test for KNK NFT",
        image_url: "https://firebasestorage.googleapis.com/v0/b/starglow-voting.firebasestorage.app/o/uploads%2F6ae71f50-4f80-4702-960d-2387a74bb628_knk.jpg?alt=media&token=400a91a8-5ed8-4446-ab54-b13f5e1d7b6a",
        report_url: "https://report.starglow.io/knk_20160303",
        external_url: "https://www.youtube.com/channel/UCoZoXoEWrZiJ1R0v6_a8PVg",
        share_percent: 17,
        glow_start: new Date(2026, 4, 1).toISOString().split("T")[0],
        glow_end: new Date(2027, 3, 31).toISOString().split("T")[0],
        amount: 50,
    });
    const [isMinting, setIsMinting] = useState(false);

    const handleLoginUserData = (data) => {
        setUpdatedUserData(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMint = async () => {
        try {
            setIsMinting(true);
            const response = await fetch('/api/sui/nft/mint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log("Mint NFT result:", result);

            if (result.success) {
                const detail = result.result;
                if (detail.digest) {
                    const nftId = detail.digest;
                    toaster({
                        message: (
                            <span>
                                NFT Minted Successfully! Visit{" "}
                                <a
                                    href={`https://suiscan.xyz/testnet/tx/${nftId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: "underline", fontWeight: "bold", color: "#fff" }}
                                >
                                    Transaction
                                </a>
                            </span>
                        ),
                        type: "success",
                    });
                }
            } else {
                console.log("Mint NFT error:", result.error);
                toaster({ message: result.error || "Failed to mint NFT", type: "error" });
            }
        } catch (error) {
            console.error("Mint NFT error:", error);
            toaster({ message: "An unexpected error occurred", type: "error" });
        } finally {
            setIsMinting(false);
        }
    };


    return (
        <div>
            <div className="flex flex-col gap-4 my-5 mx-auto justify-center items-center">
                <h1 className="text-center">Please Login Again for Safety</h1>
                <ZkLogin forceToLogin={true} onLoginUserData={handleLoginUserData} />
            </div>
            {updatedUserData && updatedUserData.allowMinting && (
                <div className="mt-10 mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center">NFT Minting</h1>

                    <div className="space-y-4">
                        <input type="text" name="name" placeholder="NFT Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded bg-[var(--background-muted)] text-white" />

                        <textarea name="description" placeholder="NFT Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded bg-[var(--background-muted)] text-[var(--text-primary)]" rows={3} />

                        <input type="text" name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} className="w-full p-2 border rounded bg-[var(--background-muted)] text-white" />

                        <ImageUploader onUploadComplete={(urls) => setFormData((prev) => ({ ...prev, image_url: urls[0] }))} />

                        <input type="text" name="report_url" placeholder="Report URL" value={formData.report_url} onChange={handleChange} className="w-full p-2 border rounded bg-[var(--background-muted)] text-white" />

                        <input type="text" name="external_url" placeholder="External Link" value={formData.external_url} onChange={handleChange} className="w-full p-2 border rounded bg-[var(--background-muted)] text-white" />

                        <input type="number" name="share_percent" placeholder="Share Percent (1-100)" min={1} max={100} value={formData.share_percent} onChange={handleChange} className="w-full p-2 border rounded bg-[var(--background-muted)] text-white" />

                        <div className="flex gap-4">
                            <input type="date" name="glow_start" value={formData.glow_start} onChange={handleChange} className="flex-1 p-2 border rounded bg-[var(--background-muted)] text-white" />
                            <input type="date" name="glow_end" value={formData.glow_end} onChange={handleChange} className="flex-1 p-2 border rounded bg-[var(--background-muted)] text-white" />
                        </div>

                        <input type="number" name="amount" placeholder="Minting Amount (more than 1)" min={1} value={formData.amount} onChange={handleChange} className="w-full p-2 border rounded bg-[var(--background-muted)] text-white" />

                        <button
                            onClick={handleMint}
                            disabled={isMinting}
                            className="button-feather-purple w-full mt-4"
                        >
                            {isMinting ? "Minting is happening..." : "Minting"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}