"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Components
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Utils
import { checkVerified, signInAction } from "@/lib/auth";
import { SchoolConfig } from "@/lib/schools";


type PasswordResetProps = {
    config: SchoolConfig
}

export default function LoginContent(config: PasswordResetProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (formData: FormData) => {
        setIsLoading(true);
        const ret = await signInAction(formData);

        if (ret.error) {
            setIsLoading(false);
            return setErrorMessage("Incorrect email or password.");
        }

        // TODO: set school cookie automatically?

        router.push("/account");
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-1">Log in</DialogTitle>
                <p className="text-sm text-secondary">Enter your email and password to log in to your account.</p>
            </DialogHeader>

            <form
                className="space-y-3"
                action={handleSignIn}
            >
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder={config.config.emailPlaceholder} required type="email" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" placeholder={config.config.passwordPlaceholder} required type="password" />
                </div>
                {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}

                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? <span className="loader"></span> : "Login"}
                </Button>
            </form>
        </>
    );
}

