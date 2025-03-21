/// app\components\Payments\KGInicis.jsx

"use client";

import { useEffect, useCallback } from "react";
import toaster from "../../toaster/toast";
import Image from "next/image";

export default function KGInicis({ userData, formData }) {
    
    const scriptUrl = process.env.NEXT_PUBLIC_KG_SCRIPT_URL;

    useEffect(() => {
        const script = document.createElement("script");
        script.src = scriptUrl;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [scriptUrl]);

    const handleCloseMessage = useCallback((event) => {
        if (event.data === "kg-close") {
            toaster({
                message: "Payment has been canceled.",
                type: "warning",
                duration: 3000,
                position: "top-center",
            });
            window.removeEventListener("message", handleCloseMessage);
            //window.location.reload();
        }
    }, []);

    const handleKGPayment = async () => {
        try {
            const response = await fetch("/api/payment/kg-inicis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: formData.id,
                    userId: userData.docId,
                    quantity: formData.quantity || 1,
                    currency: formData.currency,
                }),
            });

            const data = await response.json();

            const form = document.createElement("form");
            form.id = "ini_payment";
            form.method = "POST";

            Object.entries(data).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);

            window.INIStdPay.pay("ini_payment");

            window.addEventListener("message", handleCloseMessage);
        } catch (error) {
            console.error("Error buying NFT", error);
            toaster({
                message: "An unexpected error occurred. Please try again.",
                type: "error",
                duration: 4000,
                position: "top-center",
            });
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-md"
                onClick={handleKGPayment}
            >
                <Image src="/ui/kg-inicis.png" alt="Credit Card" width={50} height={50} />
            </button>
            <p className="mt-2">Credit Card</p>
        </div>
    );
}
