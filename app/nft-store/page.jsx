/// app\nft-store\page.jsx

import ZkLogin from "../components/zkLogin"
import NFTMinting from "./NFTMinting"

export default async function NFTStorePage() {

    return (
        <div className="bg-black">
            <h1>NFT Store</h1>
            <ZkLogin />
            <NFTMinting />
        </div>
    )
}