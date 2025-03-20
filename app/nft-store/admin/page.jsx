import NFTAdmin from "./NFTAdmin";
import { getNFTCollections, getNFTsByCollection } from "../../firebase/nfts";

export default async function NFTAdminPage() {
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
        <NFTAdmin collections={nfts} />
    );
}