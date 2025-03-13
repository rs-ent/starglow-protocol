/// app\scripts\encryption.js

import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYTION_SECRET_KEY;

export function encoding(data) {
    try {
        return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    } catch (error) {
        console.error("Error while encoding: ", error);
        return null;
    }
}

export function decoding(data) {
    try {
        const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Error while decoding: ", error);
        return null;
    }
}