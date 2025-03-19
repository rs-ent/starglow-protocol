// app\api\sui\sponsor-transaction\route.js

import { EnokiClient } from '@mysten/enoki';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const enokiClient = new EnokiClient({
      apiKey: process.env.ENOKI_PRIVATE_API,
    });
    
    const body = await req.json();
    const { transactionKindBytes, sender, allowedMoveCallTargets, allowedAddresses, network } = body;
    
    const sponsored = await enokiClient.createSponsoredTransaction({
      network,
      transactionKindBytes,
      sender,
      allowedMoveCallTargets,
      allowedAddresses,
    });
    
    return NextResponse.json(sponsored);
  } catch (error) {
    console.error('Error sponsoring transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}