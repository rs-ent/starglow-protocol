/// app\oauth\callback\google\page.jsx

"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserData, setUserData } from "../../../firebase/common";

export default function GoogleOAuthCallback() {

    useEffect(() => {
        const urlHash = window.location.hash.substring(1);
        const params = new URLSearchParams(urlHash);
        const idToken = params.get("id_token");

        if (idToken) {
            (async () => {
                const decoded = jwtDecode(idToken);
                const userId = decoded.sub;
                const loginMethod = "google";

                let userData = await getUserData(userId, loginMethod);
                console.log("Imported User Data: ", userData);
                if (!userData.salt) {
                    const userSalt = BigInt('0x' + crypto.randomUUID().replace(/-/g, '')).toString();
                    userData = await setUserData(userId, loginMethod, userSalt);
                    console.log("New User Data: ", userData);
                }
                
                userData["idToken"] = idToken;
                window.opener.postMessage({ userData }, window.location.origin);
                window.close();

            })();
        }
    }, []);

    return (
        <div className="bg-black">
        </div>
    );
}