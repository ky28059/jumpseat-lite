"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface VerifyUserEmailResponse {
    success: boolean;
    message: string;
}

export async function verifyUserEmail(token: string): Promise<VerifyUserEmailResponse> {
    try {
        const res = await prisma.verificationToken.findFirst({ where: { token } });

        if (!res) {
            return { success: false, message: "User not found or invalid token." };
        }

        const hasExpired = new Date(res.expires) < new Date();

        if (hasExpired) {
            return { success: false, message: "User not found or invalid token." };
        }

        const user = await prisma.user.findUnique({
            where: { email: res.email },
        });

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true },
            });
            return { success: true, message: "Email verified successfully!" };
        } else {
            return { success: false, message: "User not found or invalid token." };
        }
    } catch (error) {
        console.error("Error verifying email:", error);
        return { success: false, message: "Error verifying email." };
    }
}

export async function resetPassword(token: string, newPassword: string): Promise<VerifyUserEmailResponse> {
    try {
        const res = await prisma.verificationToken.findFirst({
            where: {
                token: token,
            },
        });

        if (!res) {
            return { success: false, message: "User not found or invalid token." };
        }

        const hasExpired = new Date(res.expires) < new Date();

        if (hasExpired) {
            return { success: false, message: "User not found or invalid token." };
        }

        const user = await prisma.user.findUnique({
            where: { email: res.email },
        });

        if (user) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });
            return { success: true, message: "Password reset successfully!" };
        } else {
            return { success: false, message: "User not found or invalid token." };
        }
    } catch (error) {
        console.error("Error verifying email:", error);
        return { success: false, message: "Error resetting password." };
    }
}
