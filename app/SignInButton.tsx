'use client'

import { useEffect, useState, Dispatch, SetStateAction } from "react";
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
    config?: SchoolConfig,
    hasTrigger?: boolean,
    isOpen?: boolean,
    setIsOpen?: Dispatch<SetStateAction<boolean>>
}

export default function SignInButton(props: SignInButtonProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isEmailVerify, setIsEmailVerify] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const trueIsOpen = props.isOpen ?? isOpen;
    const trueSetIsOpen = props.setIsOpen ?? setIsOpen;
    const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
    const needsTrigger = props.hasTrigger ?? true;

    // const searchParams = useSearchParams();
    const pathname = usePathname();

    // useEffect(() => {
    //     setIsOpen(searchParams.get("showModal") === "true");
    // }, [searchParams]);

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
        setIsEmailVerify(false);
        setIsPasswordReset(false);
    };

    const toggleEmailVerify = () => {
        setIsEmailVerify(!isEmailVerify);
        setIsPasswordReset(false);
    };

    const togglePasswordReset = () => {
        setIsPasswordReset(!isPasswordReset);
        setIsSignUp(false);
        setIsEmailVerify(false);
    };

    const handleSchoolSelect = (domain: string) => {
        window.location.href = `https://${domain}/${pathname}?showModal=true`;
    };

    const handleEmailVerificationClose = () => {
        setIsEmailVerificationOpen(false);
        trueSetIsOpen(false);
    };

    return (
        <Dialog open={trueIsOpen} onOpenChange={trueSetIsOpen}>
            {needsTrigger && 
            <DialogTrigger asChild>
                <button
                    onClick={() => trueSetIsOpen(true)}
                    className="px-4 py-1.5 rounded-full bg-black text-white font-medium text-sm flex gap-2 items-center"
                >
                    <FaUserCircle />
                    Sign in
                </button>
            </DialogTrigger>
            }

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
                        {isPasswordReset ? (
                            <PasswordReset config={props.config} />
                        ) : !isEmailVerify ? (
                            isSignUp ? (
                                <SignupContent
                                    config={props.config}
                                    onOpenChange={setIsOpen}
                                    onEmailVerificationClose={handleEmailVerificationClose}
                                    setIsEmailVerificationOpen={setIsEmailVerificationOpen}
                                />
                            ) : (
                                <LoginContent config={props.config} />
                            )
                        ) : (
                            <VerificationContent config={props.config}/>
                        )}

                        {!isEmailVerify && !isPasswordReset && (
                            <button className="text-blue-500 hover:underline mt-2 text-sm" onClick={toggleSignUp}>
                                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                            </button>
                        )}

                        {!isSignUp && !isPasswordReset && (
                            <button className="text-blue-500 hover:underline mt-2 text-sm" onClick={toggleEmailVerify}>
                                {isEmailVerify ? "Go back to sign in" : "Need another verification email?"}
                            </button>
                        )}

                        {!isSignUp && !isEmailVerify && (
                            <button
                                className="text-blue-500 hover:underline mt-2 text-sm"
                                onClick={togglePasswordReset}
                            >
                                {isPasswordReset ? "Go back to sign in" : "Forgot your password?"}
                            </button>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
