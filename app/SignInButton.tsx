'use client'

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Components
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoginContent from "@/components/SignIn";
import SignupContent from "@/components/SignUp";
import VerificationContent from "@/components/VerificationEmail";
import PasswordReset from "@/components/PasswordReset";

// Utils
import { SchoolConfig, schoolConfigs } from "@/lib/schools";

// Icons
import { FaUserCircle } from "react-icons/fa";


type SignInButtonProps = {
    config?: SchoolConfig
}

enum SignInDisplay {
    SIGN_IN,
    SIGN_UP,
    VERIFY_EMAIL,
    RESET_PASSWORD,
}

export default function SignInButton(props: SignInButtonProps) {
    const [display, setDisplay] = useState(SignInDisplay.SIGN_IN);
    const [isOpen, setIsOpen] = useState(false);

    // const searchParams = useSearchParams();
    const pathname = usePathname();

    // useEffect(() => {
    //     setIsOpen(searchParams.get("showModal") === "true");
    // }, [searchParams]);

    const handleSchoolSelect = (domain: string) => {
        window.location.href = `https://${domain}/${pathname}?showModal=true`;
    };

    const handleEmailVerificationClose = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-4 py-1.5 rounded-full bg-black text-white font-medium text-sm flex gap-2 items-center"
                >
                    <FaUserCircle />
                    Sign in
                </button>
            </DialogTrigger>

            <DialogContent className="px-8">
                {!props.config?.name ? (
                    <>
                        <DialogHeader>
                            <h1 className="text-2xl font-bold mb-1">Choose a School</h1>
                            <p className="text-sm text-secondary">Select your school to sign in.</p>
                        </DialogHeader>

                        {Object.entries(schoolConfigs).map(([href, config]) => (
                            <Button
                                key={href}
                                className="w-full"
                                onClick={() => handleSchoolSelect(href)}
                            >
                                {config.nameLong}
                            </Button>
                        ))}
                    </>
                ) : (
                    <>
                        {display === SignInDisplay.SIGN_IN ? (
                            <LoginContent config={props.config} />
                        ) : display === SignInDisplay.SIGN_UP ? (
                            <SignupContent
                                config={props.config}
                                onOpenChange={setIsOpen}
                                onEmailVerificationClose={handleEmailVerificationClose}
                            />
                        ) : display === SignInDisplay.VERIFY_EMAIL ? (
                            <VerificationContent config={props.config}/>
                        ) : (
                            <PasswordReset config={props.config} />
                        )}

                        {display === SignInDisplay.SIGN_IN && (
                            <button
                                className="text-blue-500 hover:underline mt-2 text-sm"
                                onClick={() => setDisplay(SignInDisplay.SIGN_UP)}
                            >
                                Don't have an account?
                            </button>
                        )}

                        {display === SignInDisplay.SIGN_UP && (
                            <button
                                className="text-blue-500 hover:underline mt-2 text-sm"
                                onClick={() => setDisplay(SignInDisplay.SIGN_IN)}
                            >
                                Already have an account?
                            </button>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
