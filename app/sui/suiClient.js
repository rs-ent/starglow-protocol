/// app\sui\suiClient.js

import { SuiClient } from '@mysten/sui/client';

const network = process.env.NEXT_PUBLIC_SUI_NETWORK;
const suiClient = new SuiClient({ 
    url: `https://fullnode.${network}.sui.io:443`,
});

export default suiClient;