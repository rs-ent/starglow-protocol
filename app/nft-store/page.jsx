/// app\nft-store\page.jsx

import NFTStore from "./NFTStore";
import { getNFTCollections, getNFTsByCollection } from "../firebase/nfts"

export default async function NFTStorePage() {

    const collections = await getNFTCollections();
    const nfts = await Promise.all(
        collections.map(async (collection) => {
            const nft = await getNFTsByCollection(collection.name);
            const serialzedCollection = {
                ...collection,
                timestamp: collection.timestamp.toDate().toISOString(),
            };
            const serializedNFT = nft.map(item => ({
                ...item,
                timestamp: item.timestamp.toDate().toISOString(),
            }));
            return { ...serialzedCollection, nft: serializedNFT };
        })
    );

    return (
        <div className="bg-black">
            <NFTStore nfts={nfts} />
        </div>
    )
}