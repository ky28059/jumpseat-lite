'use server'

import prisma from '@/lib/db/prisma';
import type { User } from '@prisma/client';
import { auth } from '@/auth';


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
    if (key === "isAdmin")
        return { error: 'Invalid field' };

    const user = await prisma.user.update({
        data: { [key]: value },
        where: { id: Number(session.user.id) }
    });
    console.log(user);

    return { ok: true }
}
