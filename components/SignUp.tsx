import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createUser } from "@/lib/auth";
import { emailSchema, firstNameSchema, lastNameSchema, passwordSchema } from "@/lib/config";
import { SchoolConfig } from "@/lib/schools";

const FormSchema = z
    .object({
        // firstName: firstNameSchema,
        // lastName: lastNameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Passwords must match.",
    });

type SignUpProps = {
    config?: SchoolConfig;
    onOpenChange?(open: boolean): void;
    onEmailVerificationClose?(): void;
    setIsEmailVerificationOpen(open: boolean): void;
};

export default function SignUp({
    config,
    onOpenChange,
    onEmailVerificationClose,
    setIsEmailVerificationOpen,
}: SignUpProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    async function handleSubmit(data: z.infer<typeof FormSchema>) {
        const emailDomain = data.email.split("@")[1];

        if (config?.email && emailDomain.endsWith(".edu")) {
            return setErrorMessage(`Due to issues with university email servers, we no longer support school emails. Please create your account with a personal email.`);
        }

        const res = await createUser(data.email, data.password, config?.name!);
        if (res.error) return setErrorMessage(res.error);

        setIsDialogOpen(true);
        setIsEmailVerificationOpen(true); // Open the email verification dialog
        setUserEmail(data.email);
    }

    return (
        <>
            <EmailVerificationDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    onEmailVerificationClose?.(); // Notify parent to close
                }}
                config={config!}
                email={userEmail}
            />

            {!isDialogOpen && (
                <>
                    <DialogHeader>
                        <h1 className="text-2xl font-bold mb-1">Create an account</h1>
                        <p className="text-sm text-secondary">
                            Enter your email and password to create an account.
                        </p>
                    </DialogHeader>

                    <Form {...form}>
                        <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
                            {/* <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem className="w-1/2">
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem className="w-1/2">
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="bruhbruh25@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder={config?.passwordPlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/*
                    <div className="text-xs mx-2 mt-1">
                        Password Requirements:
                        <ul className="list-disc ml-5">
                            <li>At least 8 characters long</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one lowercase letter</li>
                            <li>At least one number</li>
                            <li>At least one special character</li>
                        </ul>
                    </div>
                    */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder={config?.passwordPlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage /> {/* TODO: error message */}
                                    </FormItem>
                                )}
                            />
                            {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}

                            <Button type="submit" className="w-full">
                                Sign up
                            </Button>
                        </form>
                    </Form>
                </>
            )}
        </>
    );
}
