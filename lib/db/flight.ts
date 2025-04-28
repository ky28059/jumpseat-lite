'use server'

import prisma from '@/lib/db/prisma';
import type { UserBreak } from '@prisma/client';


export async function getFlights(breakID: number, airports: string[], userBreak: UserBreak) {
    return prisma.flight.findMany({
        where: {
            route: {
                breaks: {
                    some: {
                        breakID: breakID
                    }
                },
                OR: [{
                    direction: 'toSchool',
                    origin: {
                        in: airports
                    }
                }, {
                    direction: 'fromSchool',
                    destination: {
                        in: airports
                    }
                }]
            },
        },
        include: {
            route: true
        }
    });
}
