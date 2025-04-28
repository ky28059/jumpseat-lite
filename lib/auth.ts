"use server";

import prisma from "@/lib/db/prisma";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { sendVerificationEmail } from "@/lib/email/emailer";

// Utils
import { emailSchema, passwordSchema } from "@/lib/config";
import { signIn, signOut } from "@/auth";

/**
 * Creates a user in the database with the given email, password, and name.
 * @param email The user's email.
 * @param password The user's password.
 * @param firstName The user's first name.
 * @param lastName The user's last name.
 * @returns An error message, or a success indicator.
 */
export async function createUser(email: string, password: string, schoolName: string) {
    if (!emailSchema.safeParse(email).success) return { error: "Email is invalid." };
    if (!passwordSchema.safeParse(password).success) return { error: "Password is invalid." };
    // if (!firstNameSchema.safeParse(firstName).success) return { error: "First name is invalid." };
    // if (!lastNameSchema.safeParse(lastName).success) return { error: "Last name is invalid." };

    const hashedPassword = await bcrypt.hash(password, 10);
    let user = null;

    try {

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            if (!existingUser.isVerified) {
                await prisma.user.delete({
                    where: { email },
                });
                user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        school: {
                            connect: {
                                schoolName
                            }
                        }
                    },
                });
            } else {
                return { error: "User already exists." };
            }
        } else {
            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    school: {
                        connect: {
                            schoolName
                        }
                    }
                },
            });
        }
    } catch (e) {
        console.log(e)
        return { error: 'User already exists.' }
    }

    // TODO: inefficient? but unsure if we can do anything about that
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    sendVerificationEmail(email, schoolName);
    return { ok: true };
}

export async function signInAction(formData: FormData) {
    try {
        await signIn("credentials", formData);
    } catch (e) {
        if (e instanceof AuthError) {
            return { error: e.type };
        } else {
            console.log(e);
        }
    }
    return { ok: true };
}

export async function checkUser(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return { ok: true, user: user };
        }
        return { ok: false };
    } catch (e) {
        return { error: "User not found." };
    }
}

export async function checkVerified(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { error: "User not found.", ok: false}
        }
        if (user?.isVerified) {
            return { ok: true, user: user };
        }
        return { ok: false };
    } catch (e) {
        return { error: "User not found." };
    }
}

export async function signOutAction() {
    await signOut();
}

