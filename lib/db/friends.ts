'use server'

import prisma from '@/lib/db/prisma';


/**
 * Creates a friend relation between the two users with the given ids.
 * @param id1 The id of the first user.
 * @param id2 The id of the second user.
 * @returns The created relation.
 */
export async function createFriend(id1: number, id2: number) {
    return prisma.friend.create({
        data: {
            user1: { connect: { id: id1 } },
            user2: { connect: { id: id2 } }
        }
    })
}

/**
 * Deletes the friend relation between the two users with the given ids.
 * @param userId1 The id of the first user.
 * @param userId2 The id of the second user.
 * @returns An error message or success indicator.
 */
export async function deleteFriend(userId1: number, userId2: number) {
    const friendship = await prisma.friend.findFirst({
        where: {
            userId1,
            userId2
        }
    });
    if (!friendship) return { error: 'Friendship does not exist.' };

    await prisma.friend.delete({
        where: { id: friendship.id }
    });
    return { ok: true };
}

/**
 * Gets the user objects of all the friends for the given user id.
 * @param id The user id to fetch friends for.
 * @returns An error message, or the fetched friends.
 */
export async function getFriends(id: number) {
    // Fetch the referenced user, including friend relations
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            friends1: true,
            friends2: true
        }
    });
    if (!user) return { error: 'User not found' };

    // For the `friend1` relation, the other user's id is `userId2`. The reverse is true for the `friend2` relation.
    const friendUsers = await prisma.user.findMany({
        where: {
            id: {
                in: user.friends1.map(f => f.userId2)
                    .concat(user.friends2.map(f => f.userId1))
            }
        }
    });
    return { friends: friendUsers };
}
