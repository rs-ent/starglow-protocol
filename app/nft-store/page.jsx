/// app\nft-store\page.jsx

import { Suspense } from "react";
import { getNFTCollections, getNFTsByCollection } from "../firebase/nfts"
import NFTStore from "./NFTStore";
import Spinner from "../components/Spinner";

export default async function NFTStorePage() {

    const collections = await getNFTCollections();
    const nfts = await Promise.all(
        collections.map(async (collection) => {
            const nft = await getNFTsByCollection(collection.name);
            const serialzedCollection = {
                ...collection,
                timestamp: typeof collection.timestamp === "object" ? collection.timestamp.toDate().toISOString() : collection.timestamp,
            };
            const serializedNFT = nft.map(item => ({
                ...item,
                timestamp: item.timestamp.toDate().toISOString(),
            }));
            return { ...serialzedCollection, nft: serializedNFT };
        })
    );

    return (
        <Suspense
            fallback={
                <div className="bg-[rgba(0,0,0,0.5)] backdrop-blur-sm">
                    <Spinner />
                </div>
            }
        >
            <div className="bg-black">
                <NFTStore nfts={nfts} />
            </div>
        </Suspense>
    )
}