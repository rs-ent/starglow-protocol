/// app\components\Payments\GooglePay.jsx

"use client";

import { doc } from "firebase/firestore";
import { useEffect, useRef } from "react";

export default function GooglePay({ userData, formData }) {
    const paymentsClientRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://pay.google.com/gp/p/js/pay.js";
        script.async = true;
        script.onload = onGooglePayLoaded;
        document.body.appendChild(script);
    }, []);

    const baseRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
    };

    const allowedCardNetworks = ["VISA", "MASTERCARD"];
    const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

    const tokenizationSpecification = {
        type: 'PAYMENT_GATEWAY',
        parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId'
        }
    };

    const baseCardPaymentMethod = {
        type: 'CARD',
        parameters: {
            allowedAuthMethods: allowedCardAuthMethods,
            allowedCardNetworks: allowedCardNetworks
        }
    };

    const cardPaymentMethod = {
        ...baseCardPaymentMethod,
        tokenizationSpecification: tokenizationSpecification
    };

    function getGooglePaymentsClient() {
        if (paymentsClientRef.current) {
            return paymentsClientRef.current;
        }
        paymentsClientRef.current = new google.payments.api.PaymentsClient({
            environment: 'TEST',
        });
        return paymentsClientRef.current;
    };

    function onGooglePayLoaded() {
        const paymentsClient = getGooglePaymentsClient();
        const isReadyToPayRequest = {
            ...baseRequest,
            allowedPaymentMethods: [baseCardPaymentMethod],
        };

        paymentsClient.isReadyToPay(isReadyToPayRequest)
            .then(response => {
                if (response.result) {
                    console.log("Ready to pay");
                    addGooglePayButton();
                } else {
                    console.error("Unable to pay");
                }
            })
            .catch(error => {
                console.error("Error in isReadyToPay", error);
            });
    }

    function addGooglePayButton() {
        const existingButton = document.getElementById("google-pay-button").querySelector('button');
        if (existingButton) {
            return;
        }

        const paymentsClient = getGooglePaymentsClient();
        const button =
            paymentsClient.createButton({
                onClick: onGooglePaymentButtonClicked,
                buttonColor: 'black',
                buttonType: 'pay',
            });

        document.getElementById("google-pay-button").appendChild(button);
    }

    function onGooglePaymentButtonClicked() {
        const paymentDataRequest = {
            ...baseRequest,
            allowedPaymentMethods: [cardPaymentMethod],
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: (formData.price || '1.00').toString(),
                currencyCode: 'USD',
                countryCode: 'US'
            },
            merchantInfo: {
                merchantName: formData.name || 'Example Merchant'
                // merchantId: '01234567890123456789'
            }
    };

    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(paymentData => {
            fetch('/api/payment/google-pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token : paymentData.paymentMethodData.tokenizationData.token,
                    paymentData,
                    userData,
                    formData
                })
            })
            .then(res => res.json())
            .then(serverResponse => {
                console.log("Server response", serverResponse);
            })
            .catch(error => {
                console.error("Server error", error);
            });
        })
        .catch(error => {
            console.error("Payment error", error);
        });
    }

    return (
        <div className="relative w-full">
            <div id="google-pay-button"></div>
        </div>
    )
};