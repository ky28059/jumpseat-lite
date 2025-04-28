"use client";

import { DuffelPayments } from "@duffel/components";
import { DuffelResponse, PaymentIntent } from "@duffel/components";
import { useState, useEffect } from "react";
import { createPaymentIntent } from "@/lib/duffel";


export default function BuyTicket() {
    const [paymentIntent, setPaymentIntent] =
        useState<DuffelResponse<PaymentIntent> | null>(null);

    useEffect(() => {
        async function createPint() {
            const response = await createPaymentIntent("75.00");
            if (response.status == 200) {
                setPaymentIntent(response.pint!);
            }
        }
        createPint();
    }, []);

    return (
        <div className="flex items-center justify-center h-full border">
            {!paymentIntent ? (
                <div>wefoijewf</div>
            ) : (
                <div>
                    <DuffelPayments
                        paymentIntentClientToken={paymentIntent.data.client_token}
                        onFailedPayment={() => {
                            console.log("failed");
                        }}
                        onSuccessfulPayment={() => console.log("success")}
                    />
                </div>
            )}
        </div>
    );
}
