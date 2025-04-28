"use server";

import prisma from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Retrieves all breaks for a given school by its name.
 * @param schoolName The name of the school.
 * @returns A promise that resolves to an array of breaks for the specified school.
 * @throws Will throw an error if the school is not found or if there is a problem with the database query.
 */
export async function getBreaksBySchoolName(schoolName: string) {
    try {
        const school = await prisma.school.findUnique({
            where: { schoolName },
            include: {
                breaks: true,
            },
        });

        if (!school) {
            throw new Error(`School with name ${schoolName} not found`);
        }

        return school.breaks;
    } catch (error) {
        console.error(`Error fetching breaks for school ${schoolName}:`, error);
        throw error;
    }
}

export type SchoolWithShuttles = Prisma.SchoolGetPayload<{
    include: { shuttles: { include: { shuttleTimes: true } } };
}>;

/**
 * Retrieves the school object (and its included shuttles) for the given school name.
 * @param schoolName The name of the school.
 * @returns The school object (including shuttles).
 */
export async function getSchoolByName(schoolName: string) {
    return prisma.school.findUnique({
        where: { schoolName },
        include: {
            shuttles: {
                include: {
                    shuttleTimes: true
                }
            }
        },
    });
}
