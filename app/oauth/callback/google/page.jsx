/// app\oauth\callback\google\page.jsx

"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { generateRandomness, jwtToAddress } from "@mysten/sui/zklogin";
import { getUserData, setUserData, updateUserData } from "../../../firebase/user-data";
import { setSessionUserData, setEncryptedLocalUserData } from "../../../scripts/user/user";

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
                const suiAddress = jwtToAddress(idToken, userSalt);
                userData = await setUserData(userId, 'google', userSalt, {
                    idToken,
                    email,
                    name,
                    given_name,
                    family_name,
                    picture,
                    locale,
                    suiAddress
                });
            } else {
                const userSalt = userData.salt;
                const suiAddress = jwtToAddress(idToken, userSalt);
                const updatedUserData = await updateUserData(userData.docId, {
                    idToken,
                    email,
                    name,
                    given_name,
                    family_name,
                    picture,
                    locale,
                    suiAddress
                });

                userData = {
                    ...userData,
                    ...updatedUserData
                };
            }

            await setSessionUserData(userData);
            await setEncryptedLocalUserData(userData);
            window.close();
        })();
    }, []);

    return (
        <div className="bg-black">
        </div>
    );
}