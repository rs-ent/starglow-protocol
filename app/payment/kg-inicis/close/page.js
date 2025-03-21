/// app\payment\kg-inicis\close\page.js

'use client';

import { useEffect } from 'react';

export default function ClosePage() {
    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage('kg-close', '*');
        } else if (window.parent) {
            window.parent.postMessage('kg-close', '*');
        }
        window.close();
    }, []);

    return null;
}
