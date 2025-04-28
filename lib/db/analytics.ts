'use server'

import prisma from '@/lib/db/prisma';
import { Direction, SortType } from '@prisma/client';
import type { Combo } from '@/app/results/ComboCard';

function convertTimezone(inputDate: Date) {
    return new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60 * 1000);
}

export async function createAnalytics(schoolID: number, external: string[], direction: Direction, depDate: Date, userID?: number, retDate?: Date) {
    try {
        const ana = await prisma.searchAnalytics.create({
            data: {
                userID,
                schoolID,
                external,
                direction,
                depDate,
                retDate,
                onFinalize: false
            },
        });
        return {ok: true, id: ana.id};
    }
    catch (e) {
        console.error(e);
        return { ok: false };
    }
}

export async function setFinalize(analyticsID: number) {
    try {
        await prisma.searchAnalytics.update({
            where: {
                id: analyticsID
            },
            data: {
                onFinalize: true
            }
        });
        return { ok: true }
    }
    catch (e) {
        console.error(e);
        return { ok: false }
    }
}

export async function writeCombos(analyticsID: number, combos: Combo[], direction: Direction, sortType: SortType) {
    try {
        let comboIDs: number[] = [];
        for (let c of combos) {
            const newCombo = (await prisma.analyticsCombo.create({
                data: {
                    analyticsID,
                    airline: c.itinerary.flights[0].airline,
                    depTime: convertTimezone(new Date(c.itinerary.flights[0].departure_airport.time + ":00")),
                    arrTime: convertTimezone(new Date(c.itinerary.flights[c.itinerary.flights.length - 1].arrival_airport.time + ":00")),
                    direction,
                    sortType,
                    hasLayover: c.itinerary.layovers != undefined,
                    shuttleTimes: {
                        connect: c.shuttleOptions.map(option => { return { id: option.id } }) // multiple queries because connect disallowed in createMany
                    }
                },
            }));
            comboIDs.push(newCombo.id);
        }

        return { ok: true, comboIDs: comboIDs };
    }
    catch (e) {
        console.error(e);
        return { ok: false };
    }
}

export async function writeSelectedCombo(id: number, shuttleID: number, combo: Combo, direction: Direction, sortType: SortType, analyticsID: number) {
    try {
        await prisma.analyticsCombo.upsert({
            where: {
                id
            },
            update: {
                chosenShuttleID: shuttleID
            },
            create: {
                analyticsID,
                airline: combo.itinerary.flights[0].airline,
                depTime: convertTimezone(new Date(combo.itinerary.flights[0].departure_airport.time + ":00")),
                arrTime: convertTimezone(new Date(combo.itinerary.flights[combo.itinerary.flights.length - 1].arrival_airport.time + ":00")),
                direction,
                sortType,
                hasLayover: combo.itinerary.layovers != undefined,
                chosenShuttleID: shuttleID,
                shuttleTimes: {
                    connect: combo.shuttleOptions.map(option => { return { id: option.id } })
                }
            }
        });

        return { ok: true }
    }
    catch (e) {
        console.error(e);
        return { ok: false };
    }
}


export async function linkClick(analyticsID: number, servicesClicked: string[]) {
    try {
        await prisma.searchAnalytics.update({
            where: {
                id: analyticsID
            },
            data: {
                links: servicesClicked
            }
        });

        return { ok: true };
    }
    catch (e) {
        console.error(e);
        return { ok: false }
    }
}