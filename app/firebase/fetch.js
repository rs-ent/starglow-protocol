import { db } from "./firestore-voting";
import {
  doc,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function submitVote(pollId, option, deviceInfo = {}) {
    try {
        const pollDocRef = doc(db, "polls", pollId);

        const ipAddress = deviceInfo.ipAddress || "unknown";
        const logDocRef = doc(db, "polls", pollId, "logs", ipAddress);

        const logSnap = await getDoc(logDocRef);
        if (logSnap.exists()) {
            console.log("Already voted from this IP:", ipAddress);
            return; 
        }

        const pollSnap = await getDoc(pollDocRef);
        if (!pollSnap.exists()) {
            await setDoc(pollDocRef, {
                votes: { [option]: 1 },
            });
        } else {
            await updateDoc(pollDocRef, {
                [`votes.${option}`]: increment(1),
            });
        }

        await setDoc(logDocRef, {
            selectedOption: option,
            device: deviceInfo,
            timestamp: serverTimestamp(),
        });
        
    } catch (error) {
        console.error("submitVote Error:", error);
    }
}