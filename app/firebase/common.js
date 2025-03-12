/// app\firebase\common.js

import { collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firestore-voting';

export async function getUserData(userId, loginMethod) {
    try {
        const userRef = collection(db, "users");
        const q = query(userRef, where(loginMethod, "==", userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            
            await updateDoc(userDoc.ref, {
                latestLoginMethod: loginMethod,
                latestLogin: serverTimestamp()
            });

            return userDoc.data();
        } else {
            console.log("No such user found!");
            return {};
        }
    } catch (e) {
        console.error(e);
        return {};
    }
}

export async function setUserData(userId, loginMethod, salt) {
    try {
        const userData = {
            salt: salt,
            [loginMethod]: userId,
            latestLoginMethod: loginMethod,
            createdAt: serverTimestamp(),
            latestLogin: serverTimestamp()
        };

        console.log("Adding user data: ", userData);

        const docRef = await addDoc(collection(db, "users"), userData);
        console.log("Document written with ID: ", docRef.id);
        return userData;
    } catch (e) {
        console.error(e);
        return {};
    }
}