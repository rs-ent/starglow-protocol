"use client";

export default function MyNFTs({ userData = {}, nfts = [] }) {
    console.log(nfts);
    return (
        <div className="flex flex-wrap justify-center">
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
                    </div>
                </div>
            ))}
        </div>
    );
};