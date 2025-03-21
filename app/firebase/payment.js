/// app\firebase\payment.js

import { collection, doc, getDoc, updateDoc, getDocs, setDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firestore-voting';

const paymentsCollection = collection(db, 'payments');

const timestampToString = (timestamp) => {
    return timestamp ? timestamp.toDate().toISOString() : null;
};

const formatPaymentData = (docData) => ({
    ...docData,
    createdAt: timestampToString(docData.createdAt),
    updatedAt: timestampToString(docData.updatedAt),
});

export const createPendingPayment = async ({
    oid,
    productId,
    productName,
    buyerId,
    buyerName,
    buyerEmail,
    buyerTel,
    price,
    quantity,
    totalPrice,
    currency,
}) => {
    try {
        const paymentDoc = doc(paymentsCollection, oid);

        await setDoc(paymentDoc, {
            oid,
            productId,
            productName,
            buyerId,
            buyerName,
            buyerEmail,
            buyerTel,
            price,
            quantity,
            totalPrice,
            currency,
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        console.log(`Pending payment created (OID: ${oid})`);
    } catch (error) {
        console.error("Error creating pending payment:", error);
        throw error;
    }
};

export const updatePaymentStatus = async ({ oid, tid, status }) => {
    try {
        const paymentDocRef = doc(paymentsCollection, oid);

        await updateDoc(paymentDocRef, {
            tid,
            status,
            updatedAt: serverTimestamp(),
        });

        console.log(`Payment status updated to ${status} (OID: ${oid})`);
    } catch (error) {
        console.error("Error updating payment status:", error);
        throw error;
    }
};

export const getPaymentByOid = async (oid) => {
    try {
        const paymentDocRef = doc(paymentsCollection, oid);
        const paymentSnapshot = await getDoc(paymentDocRef);

        if (paymentSnapshot.exists()) {
            return formatPaymentData(paymentSnapshot.data());
        } else {
            console.warn(`Payment not found (OID: ${oid})`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching payment:", error);
        throw error;
    }
};

export const getPaymentsByProductId = async (productId) => {
    try {
        const paymentsQuery = query(
            paymentsCollection,
            where("productId", "==", productId),
            orderBy("createdAt", "desc")
        );

        const paymentsSnapshot = await getDocs(paymentsQuery);

        return paymentsSnapshot.docs.map(doc => formatPaymentData(doc.data()));
    } catch (error) {
        console.error("Error fetching payments by buyerId:", error);
        throw error;
    }
};

export const getPaymentsByBuyerId = async (buyerId) => {
    try {
        const paymentsQuery = query(
            paymentsCollection,
            where("buyerId", "==", buyerId),
            orderBy("createdAt", "desc")
        );

        const paymentsSnapshot = await getDocs(paymentsQuery);

        return paymentsSnapshot.docs.map(doc => formatPaymentData(doc.data()));
    } catch (error) {
        console.error("Error fetching payments by buyerId:", error);
        throw error;
    }
};

export const getAllPayments = async () => {
    try {
        const paymentsQuery = query(
            paymentsCollection,
            orderBy("createdAt", "desc")
        );

        const paymentsSnapshot = await getDocs(paymentsQuery);

        return paymentsSnapshot.docs.map(doc => formatPaymentData(doc.data()));
    } catch (error) {
        console.error("Error fetching all payments:", error);
        throw error;
    }
};