/// app\oauth\callback\google\page.jsx

"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { generateRandomness } from "@mysten/sui/zklogin";
import { getUserData, setUserData, updateUserData } from "../../../firebase/user-data";
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
        const {
            sub: userId,
            email,
            name,
            given_name,
            family_name,
            picture,
            locale
        } = decodedJwt;

        (async () => {
            let userData = await getUserData(userId, "google");
            if (!userData.docId || !userData.salt) {
                const userSalt = generateRandomness().toString();
                userData = await setUserData(userId, 'google', userSalt, {
                    email,
                    name,
                    given_name,
                    family_name,
                    picture,
                    locale
                });
            } else {
                const updatedUserData = await updateUserData(userData.docId, {
                    email,
                    name,
                    given_name,
                    family_name,
                    picture,
                    locale
                });
                
                userData = {
                    ...userData,
                    ...updatedUserData
                };
            }

            userData.idToken = idToken;
            console.log("User data: ", userData);
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