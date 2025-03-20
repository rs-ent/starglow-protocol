"use client";

import { useState, useEffect } from "react";
import Spinner from "../Spinner";
import Image from "next/image";

export default function Payments({ userData, formData }) {
    const [isPaying, setIsPaying] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://stgstdpay.inicis.com/stdjs/INIStdPay.js";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleKG = async () => {
        try {
            const response = await fetch("/api/payment/kg-inicis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName: formData.name,
                    productPrice: formData.price || "1000",
                    buyerName: userData.name,
                    buyerTel: "01012345678",
                    buyerEmail: userData.email,
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

            window.INIStdPay.pay('ini_payment');
        } catch (error) {
            console.error("Error buying NFT", error);
        }
    };

    return (
        <div className="relative w-full">
            {isPaying && <Spinner />}

            <h2>Choose Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <button
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-md"
                        onClick={handleKG}
                    >
                        <Image src="/ui/kg-inicis.png" alt="Credit Card" width={50} height={50} />

                    </button>
                    <p>KG Inicis</p>
                </div>
                <div>
                    <button className="flex flex-col items-center justify-center p-4 bg-white rounded-md">
                        <Image src="/ui/google-pay.png" alt="Credit Card" width={50} height={50} />
                    </button>
                    <p>Google Pay</p>
                </div>
            </div>
        </div>
    );
}