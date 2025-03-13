import { db, storage } from "./firestore-voting";
import {
    doc,
    collection,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    increment,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { appendLogClient, appendLogButton } from "../google-sheets/appendLog";
import { getPlatform, getGeographic } from "../scripts/device-info";

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
        const refinedDeviceInfo = Object.fromEntries(
            Object.entries(deviceInfo).filter(([key, value]) => value !== undefined)
        );

        const platform = getPlatform(deviceInfo);
        const geographic = await getGeographic(ipAddress);

        const logDocRef = doc(db, "polls", pollId, "logs", ipAddress);
        await setDoc(
            logDocRef,
            {
                selectedOption: option,
                device: refinedDeviceInfo,
                platform: platform,
                geographic: geographic,
                timestamp: serverTimestamp(),
            },
            { merge: true }
        );

        const rowData = [
            pollId,
            option,
            ipAddress,
            deviceInfo.language,
            platform,
            geographic.country,
            geographic.region,
            geographic.city,
        ];
        await appendLogClient(rowData);

        console.log("submitVote completed successfully.");

    } catch (error) {
        console.error("submitVote Error:", error);
    }
}

export async function clickAccessButton(deviceInfo = {}, type = "toMiniApp") {
    try {
        const docRef = doc(db, "acessButton", "accessButton");

        await setDoc(
            docRef,
            {
                clicked: increment(1),
            },
            { merge: true }
        );

        const ipAddress = deviceInfo.ipAddress || "unknown";
        const refinedDeviceInfo = Object.fromEntries(
            Object.entries(deviceInfo).filter(([key, value]) => value !== undefined)
        );

        const platform = getPlatform(deviceInfo);
        const geographic = await getGeographic(ipAddress);

        const logDocRef = doc(db, "accessButton", "accessButton", "logs", ipAddress);
        await setDoc(
            logDocRef,
            {
                device: refinedDeviceInfo,
                timestamp: serverTimestamp(),
                platform: platform,
                geographic: geographic,
            },
            { merge: true }
        );

        const rowData = [
            ipAddress,
            deviceInfo.language,
            platform,
            geographic.country,
            geographic.region,
            geographic.city,
            type,
        ];
        await appendLogButton(rowData);

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getPollResult(pollId) {
    try {
        const pollDocRef = doc(db, "polls", pollId);
        const pollSnap = await getDoc(pollDocRef);

        if (!pollSnap.exists()) {
            return null;
        }

        const pollData = pollSnap.data() || {};
        const logsColRef = collection(db, "polls", pollId, "logs");
        const logsSnapshot = await getDocs(logsColRef);

        const logs = logsSnapshot.docs.map((logDoc) => {
            const data = logDoc.data();
            return {
                id: logDoc.id,
                ...data,
                timestamp: data.timestamp ? data.timestamp.toMillis() : null,
            };
        });

        return {
            id: pollId,
            ...pollData,
            logs,
        };
    } catch (error) {
        console.error("getPollResult Error:", error);
        return null;
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

export const uploadFiles = (files, path = "uploads/", onProgress) => {
    if (!Array.isArray(files) || files.length === 0) {
        return Promise.reject(new Error("No files provided for upload."));
    }

    // UUID를 각 파일별로 미리 생성해서 매핑
    const filesWithIds = files.map(file => ({ file, id: uuidv4() }));

    const uploadPromises = filesWithIds.map(({ file, id }) => {
        return new Promise((resolve, reject) => {
            const sanitizedPath = path.endsWith("/") ? path : `${path}/`;
            const uniqueName = `${id}_${file.name}`;
            const fileRef = ref(storage, `${sanitizedPath}${uniqueName}`);
            const uploadTask = uploadBytesResumable(fileRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) onProgress(id, progress); // UUID 기반으로 진행률 콜백 호출
                },
                (error) => {
                    console.error("Upload failed for file:", file.name, error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log(`File available at: ${downloadURL}`);
                        resolve({ id, fileName: file.name, downloadURL });
                    } catch (error) {
                        console.error("Error getting download URL for file:", file.name, error);
                        reject(error);
                    }
                }
            );
        });
    });

    return Promise.all(uploadPromises);
};

export const getFileDownloadURL = async (filePath) => {
    try {
        const fileRef = ref(storage, filePath);
        const downloadURL = await getDownloadURL(fileRef);
        console.log("Download URL:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error getting file download URL:", error);
        throw error;
    }
};

export async function updateResultImg(pollId, imageUrl) {
    try {
        const pollDocRef = doc(db, "polls", pollId);
        await updateDoc(pollDocRef, {
            result_img: imageUrl,
        });
        console.log(`result_img updated for ${pollId}: ${imageUrl}`);
    } catch (error) {
        console.error("updateResultImg Error:", error);
        throw error;
    }
}