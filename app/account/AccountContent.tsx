"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Components
import EditableTextInput from "@/app/search/EditableTextInput";

// Utils
import type { User } from "@prisma/client";
import { updateProfile } from "@/lib/db/user";
// import { sendPersonalVerificationEmail } from "@/lib/email/emailer";


type AccountContentProps = {
    firstName: string,
    lastName: string,
    personalEmail: string,
    email: string,
}

export default function AccountContent(props: AccountContentProps) {
    // const [emailError, setEmailError] = useState<string | null>(null);
    const [showEmailSentNotification, setShowEmailSentNotification] = useState(false);

    const router = useRouter();

    // async function editProfileField<T extends keyof User>(field: T, value: User[T]) {
    //     if (field === "personalEmail") {
    //         if (typeof value === "string" && validateEmail(value)) {
    //             setEmailError(null);
    //             await updateProfile(field, value);
    //             await sendPersonalVerificationEmail(props.email, value);
    //             setShowEmailSentNotification(true);
    //             setTimeout(() => setShowEmailSentNotification(false), 5000);
    //             router.refresh();
    //         } else {
    //             setEmailError("Please enter a valid email address.");
    //         }
    //     } else {
    //         await updateProfile(field, value);
    //         router.refresh();
    //     }
    // }

    // const validateEmail = (email: string) => {
    //     return String(email)
    //         .toLowerCase()
    //         .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // };

    return (
        <>
            <h2 className="font-semibold text-2xl mt-16 mb-4">Account</h2>
            <div className="flex flex-col gap-3 py-6 px-8 overflow-clip transition-[height] duration-300 shadow-[0_35px_60px_-15px_rgba(0,_0,_0,_0.1)] border border-tertiary/75 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Profile Settings</h3>

                {/* <div className="flex items-center">
                    <h1 className="w-1/3">First name: </h1>
                    <EditableTextInput
                        placeholder={props.firstName}
                        value={props.firstName}
                        onChange={(value) => editProfileField("firstName", value)}
                        type="text"
                    />
                </div>

                <div className="flex items-center">
                    <h1 className="w-1/3">Last name: </h1>
                    <EditableTextInput
                        placeholder={props.lastName}
                        value={props.lastName}
                        onChange={(value) => editProfileField("lastName", value)}
                        type="text"
                    />
                </div> */}

                {/* <div className="flex flex-col">
                    <div className="flex items-center">
                        <h1 className="w-1/3">Personal Email: </h1>
                        <EditableTextInput
                            placeholder={props.personalEmail || "Enter your personal email"}
                            value={props.personalEmail}
                            onChange={(value) => editProfileField("personalEmail", value)}
                            type="email"
                            className={!props.personalEmail ? "text-gray-400" : ""}
                        />
                    </div>
                    {emailError && (
                        <div className="flex flex-row-reverse">
                            <div className="mt-2 text-sm text-red-500 w-2/3">{emailError}</div>
                        </div>
                    )}
                </div> */}

                <div className="flex items-center">
                    <h1 className="w-1/3">Password: </h1>
                    <EditableTextInput placeholder="password" value={""} onChange={(value) => {}} type="password" />
                </div>

                {showEmailSentNotification && (
                    <div className="mt-4 p-2 text-center text-green-600 border border-green-600 rounded">
                        A verification email has been sent. School mail servers are slowing down our emails; please check in a few minutes (including spam).
                    </div>
                )}
            </div>
        </>
    );
}

