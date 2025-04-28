"use server";

import { DateTime } from "luxon";

// Utils
import type { Direction } from "@prisma/client";
import type { Combo, ShuttleOption } from "@/app/results/ComboCard";
import { getSchoolByName } from "@/lib/db/school";
import { airportMap } from '@/lib/airports';
import { getFlights, Itinerary } from '@/lib/search/serp';


export type SearchPayload = {
    school: string,
    direction: Direction,
    roundTrip: boolean,
    externalAirports: string[],
    departureDate: string,
    returnDate?: string,
    carryOnCnt: number,
    checkInCnt: number,
    departureToken?: string
};

async function prepareOptions(
    shuttleOptions: ShuttleOption[],
    schoolTimeZone: string
) {
    for (const shuttleOption of shuttleOptions) {
        shuttleOption.relevantTime = shuttleOption.direction === 'toSchool'
            ? shuttleOption.depTime
            : shuttleOption.arrTime;
    }

    shuttleOptions.sort((a, b) => {
        return a.relevantTime!.valueOf() - b.relevantTime!.valueOf();
    });
    return shuttleOptions;
}

function findCompatibleShuttles(itinerary: Itinerary, shuttleOptions: ShuttleOption[], isToSchool: boolean) {
    const relevantAirport = isToSchool
        ? itinerary.flights.at(-1)!.arrival_airport
        : itinerary.flights[0].departure_airport;

    const relevantTime = DateTime.fromISO(
        relevantAirport.time.replace(' ', 'T'),
        { zone: airportMap[relevantAirport.id].zone }
    );
    const flightMinutes = relevantTime.hour * 60 + relevantTime.minute;

    let lwr = 0,
        upr = shuttleOptions.length;
    while (lwr < upr) {
        const mid = Math.floor((lwr + upr) / 2);
        const currTime = shuttleOptions[mid].relevantTime!.getUTCHours() * 60 + shuttleOptions[mid].relevantTime!.getUTCMinutes();
        if (currTime < flightMinutes) {
            lwr = mid + 1;
        } else {
            upr = mid;
        }
    }
    const maxMinutes = 240;
    const minMinutes = 60;
    let shuttles: ShuttleOption[] = [];
    let inc;
    if (isToSchool) {
        inc = 1;
    } else {
        inc = -1;
        lwr--;
    }
    while (true) {
        if (lwr == -1) lwr = shuttleOptions.length - 1;
        else if (lwr == shuttleOptions.length) lwr = 0;
        const shuttleMinutes = shuttleOptions[lwr].relevantTime!.getUTCHours() * 60 + shuttleOptions[lwr].relevantTime!.getUTCMinutes();
        let difference;
        if (isToSchool) {
            difference =
                shuttleMinutes > flightMinutes ? shuttleMinutes - flightMinutes : 1440 - flightMinutes + shuttleMinutes;
        } else {
            difference =
                shuttleMinutes < flightMinutes ? flightMinutes - shuttleMinutes : 1440 - shuttleMinutes + flightMinutes;
        }
        if (minMinutes <= difference && difference <= maxMinutes && shuttleOptions[lwr].airport == relevantAirport.id) {
            shuttles.push({ ...shuttleOptions[lwr], airportWait: difference });
        } else if (difference > maxMinutes) break;
        if (shuttles.length == 3) break;
        lwr += inc;
    }
    return shuttles;
}

export async function getCombos(payload: SearchPayload): Promise<Combo[]> {
    const school = await getSchoolByName(payload.school);
    if (!school) return [];

    const depIatas = payload.direction == "toSchool"
        ? payload.externalAirports
        : school.airportIatas;
    const arrIatas = payload.direction == "toSchool"
        ? school.airportIatas
        : payload.externalAirports;

    const flightResults = await getFlights(
        payload.roundTrip,
        depIatas,
        arrIatas,
        payload.departureDate,
        payload.carryOnCnt,
        payload.checkInCnt,
        payload.returnDate,
        payload.departureToken,
    );

    // Whether the *current flight* is to or from school. This is true if
    // 1. this is the departure search for a `toSchool` search.
    // 2. this is the return search for a `fromSchool` round-trip search.
    const isToSchool = (payload.direction == "toSchool" && !payload.departureToken)
        || (payload.direction === 'fromSchool' && !!payload.departureToken);

    // Get initial set of shuttle options that could correspond to the given payload
    const shuttleResults = school.shuttles
        .flatMap(s => s.shuttleTimes)
        .filter(time => isToSchool ? time.direction === 'toSchool' : time.direction === 'fromSchool');

    const schoolToZone: any = { Purdue: "America/New_York", UIUC: "America/Chicago", IU: "America/New_York" };

    const flightOptions = flightResults.best_flights?.concat(flightResults.other_flights) ?? flightResults.other_flights;
    const shuttleOptions = await prepareOptions(
        shuttleResults,
        schoolToZone[payload.school]
    );

    return flightOptions.map((f) => ({
        itinerary: f,
        shuttleOptions: findCompatibleShuttles(f, shuttleOptions, isToSchool),
    }));
}
