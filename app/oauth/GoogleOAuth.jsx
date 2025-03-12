/// app\oauth\GoogleOAuth.jsx

"use client";

import { useEffect } from "react";
import Image from 'next/image';

export default function GoogleOAuth() {

    const handleGoogleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
        const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI);
        const scope = encodeURIComponent("openid email profile");
        const responseType = "id_token";
        const nonce = "random_nonce_string";

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&nonce=${nonce}`;

        const popupWidth = 500;
        const popupHeight = 700;
        const left = window.screen.width / 2 - popupWidth / 2;
        const top = window.screen.height / 2 - popupHeight / 2;

        window.open(
            authUrl,
            "GoogleOAuth",
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
        );
    };

    return (
        <div>
            <button
                onClick={handleGoogleLogin}
                className="flex items-center px-4 py-2 border rounded-full shadow-sm hover:bg-gray-100 transition duration-200 bg-white"
            >
                <img src="/ui/google-icon.webp" alt="Google Logo" className="w-6 h-6 mr-2" />
                <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
        </div>
    )
}