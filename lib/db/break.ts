"use server";

import prisma from "@/lib/db/prisma";
import type { Break, BreakType } from "@prisma/client";


/**
 * Creates a breaks table entry.
 * @param schoolID The id of the school.
 * @param breakType The type of the break.
 * @param startDate The start of the break.
 * @param endDate The end of the break.
 * @returns The created entry.
 */
export async function createBreak(
    schoolID: number,
    breakType: BreakType,
    defaultStartDate: Date,
    defaultEndDate: Date
) {
    return prisma.break.create({
        data: {
            schoolID,
            breakType,
            defaultStartDate,
            defaultEndDate,
        },
    });
}

/**
 * Retrieves all break entries.
 * @returns A list of all breaks.
 */
export async function getAllBreaks(): Promise<Break[]> {
    return prisma.break.findMany();
}
