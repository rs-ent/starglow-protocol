/// app\firebase\user-data.js

import { collection, query, where, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firestore-voting';

const timestampToString = (timestamp) => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toISOString();
    }
    return null;
};


export async function getUserData(userId, loginMethod) {
    try {
        const userRef = collection(db, "users");
        const q = query(userRef, where(loginMethod, "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();

            const userData = {
                docId: userDoc.id,
                ...userDoc.data(),
                createdAt: timestampToString(data.createdAt),
                latestLogin: timestampToString(data.latestLogin),
            }
            return userData;
        } else {
            console.log("No such user found!");
            return {};
        }
    } catch (e) {
        console.error(e);
        return {};
    }
}

export async function getUserDataByDocId(docId) {
    try {
        const userDocRef = doc(db, "users", docId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();

            const userData = {
                docId: userDoc.id,
                ...userDoc.data(),
                createdAt: timestampToString(data.createdAt),
                latestLogin: timestampToString(data.latestLogin),
            };
            return userData;
        } else {
            console.log("No such user found!");
            return {};
        }
    } catch (e) {
        console.error(e);
        return {};
    }
}

export async function setUserData(userId, loginMethod, salt, additionalInfo = {}) {
    try {
        const cleanedAdditionalInfo = cleanUndefined(additionalInfo);
        const user = {
            salt: salt,
            [loginMethod]: userId,
            latestLoginMethod: loginMethod,
            createdAt: serverTimestamp(),
            latestLogin: serverTimestamp(),
            ...cleanedAdditionalInfo,
        };

        const docRef = await addDoc(collection(db, "users"), user);

        console.log("Document written with ID: ", docRef.id);
        const userData = {
            docId: docRef.id,
            ...user,
        };
        return userData;
    } catch (e) {
        console.error(e);
        return {};
    }
}

export async function updateUserData(docId, updatedInfo) {
    try {
        const docRef = doc(db, "users", docId);
        const cleanedData = cleanUndefined({
            ...updatedInfo,
            latestLogin: serverTimestamp(),
        });

        await updateDoc(docRef, cleanedData);
        return {
            docId,
            ...cleanedData,
        };
    } catch (e) {
        console.error(e);
        return {};
    }
}

const cleanUndefined = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
};