'use server'

import prisma from '@/lib/db/prisma';
import type { UserBreak } from '@prisma/client';


// get all of the routes and their associated flights 
export async function getRoutes(breakID: number, externalAirports: string[], userBreak: UserBreak, excludedAirlines: string[], excludedAirports: string[]) {
    return prisma.route.findMany({
        where: {
            isActive: {
                equals: true
            },
            breaks: {
                some: {
                    breakID: breakID
                }
            },
            OR: [{
                direction: 'toSchool',
                origin: {
                    in: externalAirports
                },
                destination: {
                    notIn: excludedAirports
                }
            }, {
                direction: 'fromSchool',
                destination: {
                    in: externalAirports
                },
                origin: {
                    notIn: excludedAirports
                }
            }]
        },
        include: {
            flights: {
                where: {
                    AND: [{
                        OR: [{
                            depTime: {
                                gte: userBreak.depStartTime,
                                lte: userBreak.depEndTime
                            },
                            route: {
                                direction: {
                                    equals: "fromSchool"
                                }
                            }
                        }, {
                            depTime: {
                                gte: userBreak.retStartTime,
                                lte: userBreak.retEndTime
                            },
                            route: {
                                direction: {
                                    equals: "toSchool"
                                }
                            }
                        }]
                    }, {
                        ...userBreak.needsCarryOn && { hasCarryOn: { equals: userBreak.needsCarryOn } },
                        ...userBreak.noLayovers && { layoverAirport: { equals: "" } },
                        airline: {
                            notIn: excludedAirlines
                        }
                    }]
                }
            }
        }
    });
}
