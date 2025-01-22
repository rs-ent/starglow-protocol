import admin from "firebase-admin";

const serviceKeyString = process.env.FIREBASE_SERVER;
const serviceAccount = JSON.parse(serviceKeyString);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "starglow-voting.appspot.com",
    });
}
  
  export const bucket = admin.storage().bucket();