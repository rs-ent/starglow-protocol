/// app\nft-store\page.jsx

import ZkLogin from "../components/zkLogin"
import NFTStore from "./NFTStore"

export default async function NFTStorePage() {

    return (
        <div className="bg-black">
            <ZkLogin />
            <NFTStore />
        </div>
    )
}