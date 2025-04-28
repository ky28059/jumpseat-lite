"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Util
import { resetPassword } from "@/lib/verification";
import { passwordSchema } from "@/lib/config";

const FormSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Passwords must match.",
        path: ["confirmPassword"],
    });

export default function PasswordResetPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!token) {
            setErrorMessage("Invalid token.");
            return;
        }

        try {
            const result = await resetPassword(token, data.password);
            if (result.success) {
                setSuccessMessage("Password reset successfully! Redirecting to home...");
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage("An error occurred while resetting the password.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-6 rounded-lg shadow-md">
                <DialogHeader>
                    <h1 className="text-2xl font-bold mb-1">Set New Password</h1>
                    <p className="text-sm text-secondary">
                        Please enter and confirm your new password.
                    </p>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirm new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}
                        {successMessage && <p className="text-success text-sm">{successMessage}</p>}

                        <Button type="submit" className="w-full">
                            Set New Password
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
