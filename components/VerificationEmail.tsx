'use client'

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmailVerificationDialog from "./EmailVerification";

// Util
import type { SchoolConfig } from "@/lib/schools";
import { emailSchema } from "@/lib/config";
// import { sendVerificationEmail } from "@/lib/email/emailer";
import { checkUser } from "@/lib/auth";


const FormSchema = z.object({
    email: emailSchema,
});

type PasswordResetProps = {
    config: SchoolConfig
};

export default function VerificationEmail(config: PasswordResetProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    async function handleSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const email = data.email;

            const res = await checkUser(email);
            if (res.ok) {
                // await sendVerificationEmail(email, config.config.name);
                setIsDialogOpen(true);
                setUserEmail(data.email);
            } else {
                setErrorMessage("No user found with this email address.");
            }
        } catch (error) {
            setErrorMessage("An error occurred while sending the email.");
        }
    }

    return (
        <>
            <EmailVerificationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                email={userEmail}
                config={config.config}
            />

            {!isDialogOpen && (
                <>
                    <DialogHeader>
                        <h1 className="text-2xl font-bold mb-1">Resend Verification Email</h1>
                        <p className="text-sm text-secondary">
                            Send another verification email if you are unable to log in.
                        </p>
                    </DialogHeader>

                    <Form {...form}>
                        <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder={config.config.emailPlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}

                            <Button type="submit" className="w-full">
                                Resend
                            </Button>
                        </form>
                    </Form>
                </>
            )}
        </>
    );
}
