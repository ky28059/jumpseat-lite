"use client";

import { useState } from 'react';
import Link from 'next/link';

// Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function EmailWarningAlert() {
    const [showEmailWarning, setShowEmailWarning] = useState(true);
    if (!showEmailWarning) return null;

    return (
            <Alert className="flex sm:justify-between items-start border border-yellow-500 mx-16 w-full sm:max-w-[900px] sm:flex-row flex-col">
            <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                <div>
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                        Your personal email is not set. Please update your email on the account page.
                    </AlertDescription>
                </div>
            </div>
                <div className="flex gap-2 sm:gap-4 sm:mt-0 mt-3 sm:w-auto w-full sm:justify-normal justify-end">
                <Link href="/account" passHref>
                    <Button className="bg-secondary text-white">
                        Go to Account
                    </Button>
                </Link>
                    <Button className="bg-secondary text-white" onClick={() => setShowEmailWarning(false)}>
                    Close
                </Button>
            </div>
        </Alert>
    );
}
