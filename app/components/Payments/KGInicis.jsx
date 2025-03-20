/// app\components\Payments\KGInicis.jsx

"use client";

import { useEffect } from "react";
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
    }, []);

    const handleKG = async () => {
        try {
            const quantity = formData.quantity || 1;
            const totalPrice = (formData.price || 1000) * quantity;
            
            const response = await fetch("/api/payment/kg-inicis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productName: `${formData.name} x${quantity}`,
                    productPrice: totalPrice.toString(),
                    buyerName: userData.name || "",
                    buyerTel: userData.tel || "",
                    buyerEmail: userData.email || "",
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
        <div>
            <button
                className="flex flex-col items-center justify-center p-4 bg-white rounded-md"
                onClick={handleKG}
            >
                <Image src="/ui/kg-inicis.png" alt="Credit Card" width={50} height={50} />

            </button>
            <p>Credit Card</p>
        </div>
    )
};