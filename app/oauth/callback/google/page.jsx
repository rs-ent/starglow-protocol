/// app\oauth\callback\google\page.jsx

"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { generateRandomness } from "@mysten/sui/zklogin";
import { getUserData, setUserData } from "../../../firebase/common";
import { encoding } from "../../../scripts/encryption";

export default function GoogleOAuthCallback() {

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const idToken = params.get("id_token");
        if (!idToken) {
            console.error("No id_token found in callback");
            return;
        }
        const decodedJwt = jwtDecode(idToken);
        const userId = decodedJwt.sub;

        (async () => {
            let userData = await getUserData(userId, "google");
            
            if (!userData || !userData.salt) {
                const userSalt = generateRandomness().toString();
                userData = await setUserData(userId, 'google', userSalt);
            }
            userData.idToken = idToken;
            const encryptedUserData = encoding(JSON.stringify(userData));
            localStorage.setItem("userData", encryptedUserData);
            window.close();
        })();
    }, []);

    return (
        <div className="bg-black">
        </div>
    );
}