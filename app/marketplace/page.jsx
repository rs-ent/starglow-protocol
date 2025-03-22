/// app\marketplace\page.jsx

import { getMarketplaceListings } from "../firebase/marketplace";
import Marketplace from "./Marketplace";

export default async function MarketplacePage() {
    let listings = [];

    try {
        listings = await getMarketplaceListings();
    } catch (error) {
        console.error("Error fetching listings:", error);
    }

    return (
        <Marketplace initialListings={listings} />
    );
}