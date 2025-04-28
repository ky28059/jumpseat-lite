"use client";

import { verifyPersonalEmail } from "@/lib/verification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPersonal() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const router = useRouter();

    const [status, setStatus] = useState("Verifying...");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            const result = await verifyPersonalEmail(token);
            if (result.success) {
                setStatus("Email verified successfully!");
            } else {
                setStatus(
                    "Could not verify email. Please go to home page and click sign in to send another verification email"
                );
            }
        } catch (error) {
            setStatus(
                "Could not verify email. Please go to home page and click sign in to send another verification email"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className={"text-2xl font-bold mb-4"}>{status}</h1>
            {!isLoading && (
                <button
                    onClick={() => router.push("/account")}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                >
                    Go to Home
                </button>
            )}
        </div>
    );
}

