"use server";

import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient";
import { template } from "./template";
import { templatePersonal } from "./templatePersonal";
import { templateReset } from "./templateReset";
import prisma from "../db/prisma";
import { v4 as uuidv4 } from "uuid";

const baseUrl = "jumpseatapp.com"

const generateToken = async (email: string)  => {
    try {
        const existingToken = await prisma.verificationToken.findFirst({
            where: {
                email: email,
            },
        });

        const token = uuidv4();
        const expires = new Date().getTime() + 1000 * 60 * 60 * 1;

        if (existingToken) {
            await prisma.verificationToken.delete({
                where: {
                    id: existingToken.id,
                },
            });
        }

        const verificationToken = await prisma.verificationToken.create({
            data: {
                email,
                token,
                expires: new Date(expires),
            },
        });

        return verificationToken;
    } catch (e) {
        console.log(e);
    }
};

const generateVerificationLink = (baseUrl: string, token: string, school: string): string => {
    return `https://${school}.${baseUrl}/verify/verify?token=${token}`;
};

const generateVerificationLinkPersonal = (baseUrl: string, token: string, school: string): string => {
    return `https://${school}.${baseUrl}/verifyPersonal/verifyPersonal?token=${token}`;
};

const generateResetLink = (baseUrl: string, token: string, school: string): string => {
    return `https://${school}.${baseUrl}/passwordReset/passwordReset?token=${token}`;
};

const getUpdatedHtmlBody = (verificationLink: string): string => {
    return template.replace("{{ verification_link }}", verificationLink);
};

const getUpdatedPersonalHtmlBody = (verificationLink: string): string => {
    return templatePersonal.replace("{{ verification_link }}", verificationLink);
};

const getUpdatedResetHtmlBody = (verificationLink: string): string => {
    return templateReset.replace("{{ verification_link }}", verificationLink);
};

const createSendEmailCommand = (toAddress: string, fromAddress: string, htmlBody: string, subject: string): SendEmailCommand => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: [toAddress],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [],
    });
};

const sendVerificationEmail = async (email: string, schoolName: string): Promise<void> => {
    const tokenObject = await generateToken(email);
    const token = tokenObject?.token;
    if (!token) return;
    const verificationLink = generateVerificationLink(baseUrl, token, schoolName);

    const htmlBody = getUpdatedHtmlBody(verificationLink);

    const sendEmailCommand = createSendEmailCommand(email, "noreply@jumpseatapp.com", htmlBody, "Verify Your Jumpseat Account");

    try {
        const result = await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught as { name: string };
            console.error("Message rejected:", messageRejectedError);
        } else {
            console.error("Error sending email:", caught);
        }
    }
};

// const sendPersonalVerificationEmail = async (email: string, personalEmail: string): Promise<void> => {
//     const tokenObject = await generateToken(email);
//     const token = tokenObject?.token;
//     if (!token) return;
//     // const baseUrl = "https://localhost:3000";
//     const verificationLink = generateVerificationLinkPersonal(baseUrl, token, email.split("@")[1].split(".")[0]);

//     const htmlBody = getUpdatedPersonalHtmlBody(verificationLink);

//     const sendEmailCommand = createSendEmailCommand(personalEmail, "noreply@jumpseatapp.com", htmlBody, "Verify Your Personal Email for Jumpseat");

//     try {
//         const result = await sesClient.send(sendEmailCommand);
//     } catch (caught) {
//         if (caught instanceof Error && caught.name === "MessageRejected") {
//             const messageRejectedError = caught as { name: string };
//             console.error("Message rejected:", messageRejectedError);
//         } else {
//             console.error("Error sending email:", caught);
//         }
//     }
// };

const sendResetEmail = async (email: string, schoolName: string): Promise<void> => {
    const tokenObject = await generateToken(email);
    const token = tokenObject?.token;
    if (!token) return;
    // const baseUrl = "https://localhost:3000";
    const verificationLink = generateResetLink(baseUrl, token, schoolName);

    const htmlBody = getUpdatedResetHtmlBody(verificationLink);

    const sendEmailCommand = createSendEmailCommand(email, "noreply@jumpseatapp.com", htmlBody, "Reset Your Jumpseat Account Password");

    try {
        const result = await sesClient.send(sendEmailCommand);
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught as { name: string };
            console.error("Message rejected:", messageRejectedError);
        } else {
            console.error("Error sending email:", caught);
        }
    }
};

export { sendVerificationEmail, sendResetEmail };

