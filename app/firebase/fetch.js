import { db } from "./firestore-voting";
import {
  doc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function submitVote(pollId, option, deviceInfo = {}) {
    try {
        const pollDocRef = doc(db, "polls", pollId);

        await setDoc(
            pollDocRef,
            {
                votes: {
                    [option]: increment(1),
                },
            },
            { merge: true }
        );

        const ipAddress = deviceInfo.ipAddress || "unknown";
        const logDocRef = doc(db, "polls", pollId, "logs", ipAddress);
        await setDoc(
            logDocRef, 
            {
                selectedOption: option,
                device: deviceInfo,
                timestamp: serverTimestamp(),
            },
            { merge: true }
        );        
    } catch (error) {
        console.error("submitVote Error:", error);
    }
}

export async function getPollsResults() {
    try {
        const pollsColRef = collection(db, "polls");
        const snapshot = await getDocs(pollsColRef);
    
        const polls = await Promise.all(
            snapshot.docs.map(async (pollDoc) => {
                const pollId = pollDoc.id;
                const pollData = pollDoc.data() || {};
        
                // Fetch logs subcollection for this poll
                const logsColRef = collection(db, "polls", pollId, "logs");
                const logsSnapshot = await getDocs(logsColRef);
        
                const logs = logsSnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                      id: doc.id,
                      ...data,
                      timestamp: data.timestamp 
                        ? data.timestamp.toMillis() // or toDate() or toISOString()
                        : null
                    };
                });
        
                return {
                    id: pollId,
                    ...pollData,
                    logs,
                };
            })
        );
    
        return polls;
    } catch (error) {
        console.error("getAllPolls Error:", error);
        return [];
    }
}