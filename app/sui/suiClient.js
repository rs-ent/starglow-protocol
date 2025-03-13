/// app\sui\suiClient.js

import { SuiClient } from '@mysten/sui/client';

const suiClient = new SuiClient({ 
    url: process.env.NEXT_PUBLIC_SUI_RPC_URL,
});

export default suiClient;