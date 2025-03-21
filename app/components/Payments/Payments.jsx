/// app\components\Payments\Payments.jsx

"use client";

import { useState } from "react";
import Spinner from "../Spinner";
import KGInicis from "./KGInicis";

export default function Payments({ userData, formData }) {
    const [isPaying, setIsPaying] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);

    return (
        <div className="relative w-full">
            {isPaying && <Spinner />}

            <h2>Choose Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
                <KGInicis userData={userData} formData={formData} />
            </div>
        </div>
    );
}