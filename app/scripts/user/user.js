import { encoding, decoding } from "../encryption";

export async function setSessionUserData(userData) {
    const res = await fetch("/api/session-storage/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData }),
    });
    const data = await res.json();
    if (data.success) {
        return data.user;
    }
}

export async function getSessionUserData() {
    const res = await fetch("/api/session-storage/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
        return data.user;
    }
}

export async function setEncryptedLocalUserData(userData) {
    const encryptedUserData = encoding(JSON.stringify(userData));
    localStorage.setItem("userData", encryptedUserData);
    return encryptedUserData;
}

export async function getEncryptedLocalUserData() {
    const encodedUserData = localStorage.getItem("userData");
    const userData = encodedUserData ? JSON.parse(decoding(encodedUserData)) : null;
    return userData;
}

export async function logout() {
    const res = await fetch("/api/session-storage/user/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if(data.success) {
        sessionStorage.clear();
        return true;
    }
}