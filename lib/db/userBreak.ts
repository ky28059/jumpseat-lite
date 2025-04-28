"use server"

import prisma from '@/lib/db/prisma';
import type { Prisma, UserBreak } from "@prisma/client";
import { auth } from '@/auth';
import { ValueOf } from 'next/dist/shared/lib/constants';

/**
 * Inserts a new UserBreak entry for a user.
 * @param breakID The ID of the break.
 * @param depStartTime The start time for the departure.
 * @param depEndTime The end time for the departure.
 * @param retStartTime The start time for the return.
 * @param retEndTime The end time for the return.
 * @param airlines The list of preferred airlines.
 * @param noLayovers Whether the user prefers no layovers.
 * @param needsCarryOn Whether the user needs a carry-on.
 * @param hasBooked Whether the user has already booked a flight.
 * @returns The newly created UserBreak entry.
 */
export async function createUserBreak(
    breakID: number,
    depStartTime: Date,
    depEndTime: Date,
    retStartTime: Date,
    retEndTime: Date,
    noLayovers: boolean = false,
    needsCarryOn: boolean = false,
    hasBooked: boolean = false
) {
    const session = await auth();
    if (!session?.user.id) return { error: 'Unauthenticated' };

    try {
        return await prisma.userBreak.create({
            data: {
                userID: Number(session.user.id),
                breakID,
                depStartTime,
                depEndTime,
                retStartTime,
                retEndTime,
                noLayovers,
                needsCarryOn,
                hasBooked
            },
        });
    } catch (error) {
        console.error("Error creating UserBreak entry: ", error);
        throw error;
    }
}

/**
 * Updates a UserBreak based on userBreakID
 * @param userBreakID The ID of the break associated with the UserBreak.
 * @param updateData The data to update (preferences such as airlines, noLayovers, needsCarryOn, etc.).
 */
export async function updateUserBreak(
    userBreakID: number,
    updateData: Partial<UserBreak>
) {
    const session = await auth();
    if (!session?.user.id)
        return { error: 'Unauthenticated' };
    try {
        const updatedBreak = await prisma.userBreak.updateMany({
            where: {
                id: userBreakID
            },
            data: updateData,
        });

        if (updatedBreak.count === 0) {
            console.log('No UserBreak found for the given userID and breakID.');
            return null;
        }

        console.log('UserBreak updated successfully');
        return updatedBreak;
    } catch (error) {
        console.error('Error updating UserBreak:', error);
        throw error;
    }
}

/**
 * Fetch a UserBreak given the user ID and break ID.
 * @param breakID The ID of the break.
 */
export async function getUserBreak(breakID: number) {
    const session = await auth();
    if (!session?.user.id) return null;

    try {
        const userBreak = await prisma.userBreak.findFirst({
            where: {
                userID: Number(session.user.id),
                breakID: breakID,
            },
        });

        if (!userBreak) {
            console.log('No UserBreak found for the given user and break ID.');
            return null;
        }
        return userBreak;
    } catch (error) {
        console.error('Error fetching UserBreak:', error);
        throw error;
    }
}

/**
 * Fetch all UserBreaks pertaining to a user
 */
export async function getUserBreaks() {
    const session = await auth();
    if (!session?.user.id) return null;

    try {
        const userBreaks = await prisma.userBreak.findMany({
            where: {
                userID: Number(session.user.id)
            },
            include: {
                break: true
            }
        });

        if (!userBreaks) {
            console.log('No UserBreaks found for the given user and break ID.');
            return null;
        }
        return userBreaks;
    } catch (error) {
        console.error('Error fetching UserBreaks:', error);
        throw error;
    }
}


export type UserBreakWithBreakRouteAndFlight = Prisma.UserBreakGetPayload<{
    include: { break: { include: { routes: { include: { route: { include: { flights: true } } } }, school: true } } }
}>;

/**
 * Fetch all of the userBreaks and associated routes/flights for a user
 */
export async function getUserBreaksWithFlights(externalAirports: string[], userID: number) {

    try {
        const userBreaks = await prisma.userBreak.findMany({
            orderBy: [
                {
                    break: {
                        defaultStartDate: 'asc'
                    }
                }
            ],
            where: {
                userID,
                break: {
                    isActive: {
                        equals: true
                    }
                }
            },
            include: {
                break: {
                    include: {
                        routes: {
                            where: {
                                route: {
                                    isActive: {
                                        equals: true
                                    },
                                    OR: [{
                                        direction: 'toSchool',
                                        origin: {
                                            in: externalAirports
                                        }
                                    }, {
                                        direction: 'fromSchool',
                                        destination: {
                                            in: externalAirports
                                        }
                                    }]
                                }
                            },
                            include: {
                                route: {
                                    include: {
                                        flights: true
                                    }
                                }
                            }
                        },
                        school: true
                    }
                },
            }
        });
        if (!userBreaks) {
            console.log("no user breaks found for the user");
            return null;
        }
        return userBreaks;
    }
    catch (e) {
        console.error(`Error fetching UserBreaks: ${e}`);
        throw e;
    }
}


/**
 * Mark user break as booked
 * @param userBreakID the id of the userbreak
 */
export async function markAsBooked(userBreakID: number, newStatus: boolean) {
    try {
        await prisma.userBreak.update({
            where: {
                id: userBreakID
            },
            data: {
                hasBooked: newStatus
            }
        })
    }
    catch (e) {
        console.error(`Error marking UserBreak as booked: ${e}`);
        throw e;
    }
}