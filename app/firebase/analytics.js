"use client"; // 클라이언트 컴포넌트

import { getAnalytics, isSupported } from "firebase/analytics";
import { useEffect, useState } from "react";
import { app } from "./firestore-voting"; // 또는 firebaseConfig 재사용

export default function AnalyticsClient() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    isSupported().then((supported) => {
        if (supported) {
            const analyticsInstance = getAnalytics(app);
            setAnalytics(analyticsInstance);
            console.log("Firebase Analytics initialized!");
        } else {
            console.log("Analytics not supported in this environment.");
        }
    });
  }, []);

  return null;
}