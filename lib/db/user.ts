'use server'

import prisma from '@/lib/db/prisma';
import type { User } from '@prisma/client';
import { auth } from '@/auth';


// TODO: delete, insecure
export async function getUsers() {
    const users = await prisma.user.findMany();
    return users;
}


export async function setUpAutopilot() {
    const session = await auth();
    if (!session?.user.id)
        return { error: 'Unauthenticated' };
    const userID = session.user.id;
    const userInfo = await prisma.user.update({
        where: {
            id: Number(userID)
        },
        data: {
            inAutopilot: true
        },
        select: {
            school: {
                include: {
                    breaks: {
                        where: {
                            isActive: true
                        }
                    }
                }
            }
        }
    });

    const millisecondsTo1159 = (23 * 60 + 59) * 60 * 1000;
    const millisecondsInADay = 24 * 60 * 60 * 1000;

    try {
            await prisma.userBreak.createMany({
                data: userInfo?.school?.breaks.map((breakInfo) => {
                    const defaultStartDate = breakInfo.defaultStartDate.getTime();
                    const defaultEndDate = breakInfo.defaultEndDate.getTime();
                    return {
                        userID: Number(userID),
                        breakID: breakInfo.id,
                        depStartTime: new Date(defaultStartDate - breakInfo.leftStartRange * millisecondsInADay),
                        depEndTime: new Date(defaultStartDate + breakInfo.rightStartRange * millisecondsInADay + millisecondsTo1159),
                        retStartTime: new Date(defaultEndDate - breakInfo.leftEndRange * millisecondsInADay),
                        retEndTime: new Date(defaultEndDate + breakInfo.rightEndRange * millisecondsInADay + millisecondsTo1159),
                    }
                })!,
                skipDuplicates: true
            });
    }
    catch (e) {
        console.error(`Error creating userBreak records: ${e}`);
        throw e;
    }

    return { ok: true }

}


/**
 * Updates the currently signed-in user's profile.
 * @param key The key to update (one of 'firstName', 'lastName').
 * @param value The new value of the key.
 */
export async function updateProfile<T extends keyof User>(key: T, value: User[T]) {
    const session = await auth();
    if (!session?.user.id)
        return { error: 'Unauthenticated' };
    // Disallow editing restricted fields (ex. 'isAdmin')
    if (key == "isAdmin")
        return { error: 'Invalid field' };

    const user = await prisma.user.update({
        data: { [key]: value },
        where: { id: Number(session.user.id) }
    });
    console.log(user);

    return { ok: true }
}

// TODO: insecure
/**
 * Fetches a user object based on the user ID.
 * @param userID The ID of the user to fetch.
 * @returns The user object or null if not found.
 */
export async function getUserById(userID: number) {
    try {
        return await prisma.user.findUnique({
            where: {
                id: userID,
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
    }
}
