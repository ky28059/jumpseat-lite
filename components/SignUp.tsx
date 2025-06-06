import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
};

export default function SignUp({ config }: SignUpProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    async function handleSubmit(data: z.infer<typeof FormSchema>) {
        const res = await createUser(data.email, data.password, config?.name!);
        if (res.error) return setErrorMessage(res.error);

        setIsDialogOpen(true);
        // setIsEmailVerificationOpen(true); // Open the email verification dialog
        setUserEmail(data.email);
    }

    return (
        <>
            {/*
            <EmailVerificationDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    onEmailVerificationClose?.(); // Notify parent to close
                }}
                config={config!}
                email={userEmail}
            />
            */}

            {!isDialogOpen && (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold mb-1">Create an account</DialogTitle>
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
                                            <Input placeholder={config?.emailPlaceholder ?? 'joe@example.com'} {...field} />
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
