/// app\nft-store\NFTStore.jsx
"use client";

export default function NFTStore({ nftList = [] }) {
    return (
        <section className="section-base bg-[var(--background-second)]">
            <h2 className="section-title font-main-bold text-glow-strong">
                My Minted NFTs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nftList.map((nft, index) => (
                    <div
                        key={index}
                        className="rounded-xl purple-glow-7 bg-[var(--background-muted)] p-4 transition-all hover:purple-glow-12 hover:-translate-y-1 cursor-pointer"
                    >
                        <img
                            src={nft.image_url}
                            alt={nft.name}
                            className="w-full h-60 object-cover rounded-lg"
                        />

                        <div className="mt-3">
                            <h3 className="text-gradient font-main-bold text-xl truncate">
                                {nft.name}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] truncate">
                                {nft.description}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="text-xs font-medium bg-[var(--primary)] text-white px-2 py-1 rounded">
                                    Shares: {nft.share_percent}%
                                </span>
                                <span className="text-xs font-medium bg-[var(--accent)] text-[var(--text-reverse)] px-2 py-1 rounded">
                                    Amount: {nft.amount}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
