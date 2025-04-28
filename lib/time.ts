import { DateTime } from 'luxon';
import { differenceInMinutes } from 'date-fns';
import type { ShuttleOption } from '@/app/results/ComboCard';
import type { Itinerary } from '@/lib/search/serp';
import type { Airport } from '@/lib/airports';


function getHoursMinutes(diffMinutes: number) {
    const minutes = diffMinutes % 60;
    const hours = (diffMinutes - minutes) / 60;

    return [hours, minutes];
}

/**
 * Converts two dates into a short duration string.
 * @param s The start of the duration.
 * @param e The end of the duration.
 * @returns The duration, as `{hours}h {minutes}m`.
 */
export function formatDurationShort(s: Date, e: Date) {
    return formatMinutesShort(differenceInMinutes(e, s));
}

export function formatDateTimesShort(s: DateTime, e: DateTime) {
    return formatMinutesShort(e.diff(s, 'minutes').minutes);
}

/**
 * Converts a quantity of minutes into a short duration string.
 * @param m The length of the duration in minutes.
 * @returns The duration, as `{hours}h {minutes}m`.
 */
export function formatMinutesShort(m: number) {
    const [hours, minutes] = getHoursMinutes(m);
    return (hours ? `${hours}h` : '')
        + (hours && minutes ? ' ' : '')
        + (minutes ? `${minutes}m` : '');
}

/**
 * Converts two dates into a medium duration string.
 * @param s The start of the duration.
 * @param e The end of the duration.
 * @returns The duration, as `{hours} hr {minutes} min`.
 */
export function formatDurationMed(s: Date, e: Date) {
    return formatMinutesMed(differenceInMinutes(e, s));
}

export function formatDateTimesMed(s: DateTime, e: DateTime) {
    return formatMinutesMed(e.diff(s, 'minutes').minutes);
}

/**
 * Converts a quantity of minutes into a medium duration string.
 * @param m The length of the duration in minutes.
 * @returns The duration, as `{hours} hr {minutes} min`.
 */
export function formatMinutesMed(m: number) {
    const [hours, minutes] = getHoursMinutes(m);
    return (hours ? `${hours} hr` : '')
        + (hours && minutes ? ' ' : '')
        + (minutes ? `${minutes} min` : '');
}

export function calculateComboTimes(
    itinerary: Itinerary,
    shuttle: ShuttleOption,
    airportMap: { [iata: string]: Airport }
) {
    const flightDepTime = DateTime.fromISO(itinerary.flights[0].departure_airport.time.replace(' ', 'T'))
        .setZone(airportMap[itinerary.flights[0].departure_airport.id].zone, { keepLocalTime: true });

    const flightArrTime = DateTime.fromISO(itinerary.flights.at(-1)!.arrival_airport.time.replace(' ', 'T'))
        .setZone(airportMap[itinerary.flights.at(-1)!.arrival_airport.id].zone, { keepLocalTime: true });

    const { shuttleDepTime, shuttleArrTime } = calculateShuttleTimes(shuttle, flightDepTime, flightArrTime);

    const shuttleBefore = shuttleDepTime.valueOf() < flightDepTime.valueOf();
    const start = shuttleBefore ? shuttleDepTime : flightDepTime;
    const end = shuttleBefore ? flightArrTime : shuttleArrTime;

    // Airport wait time
    const waitStart = shuttleBefore ? shuttleArrTime : flightArrTime;
    const waitEnd = shuttleBefore ? flightDepTime : shuttleDepTime;
    const shuttleWaitMinutes = waitEnd.diff(waitStart, 'minutes').minutes;

    // const layoverMinutes = itinerary.layovers?.reduce((a, b) => a + b.duration, 0) ?? 0;

    return {
        start,
        end,
        flightDepTime,
        flightArrTime,
        shuttleDepTime,
        shuttleArrTime,
        shuttleBefore,
        shuttleWaitMinutes,
        totalMinutes: end.diff(start, 'minutes').minutes
    }
}

export function calculateShuttleTimes(shuttle: ShuttleOption, flightDepTime: DateTime, flightArrTime: DateTime) {
    // Set shuttle times on either the departure or arrival date to account for flights that encompass a date
    // boundary (i.e. pass 12 AM).
    const relevantFlightTime = shuttle.direction === 'fromSchool' ? flightDepTime : flightArrTime;

    // Account for shuttle routes that encompass a date boundary (i.e. pass 12 AM).
    const passesMidnight = shuttle.arrTime < shuttle.depTime;

    const shuttleDepTime = relevantFlightTime
        .set({ hour: shuttle.depTime.getUTCHours(), minute: shuttle.depTime.getUTCMinutes() })
        .setZone(shuttle.depTimeZone, { keepLocalTime: true });

    const shuttleArrTime = relevantFlightTime
        .set({ hour: shuttle.arrTime.getUTCHours(), minute: shuttle.arrTime.getUTCMinutes() })
        .plus({ day: passesMidnight ? 1 : 0 })
        .setZone(shuttle.arrTimeZone, { keepLocalTime: true });

    return { shuttleDepTime, shuttleArrTime };
}

export function formatTimeRange(depTime: DateTime, arrTime: DateTime) {
    const formattedDepTime = depTime.setLocale('en-us').toLocaleString({
        hour: "numeric",
        minute: "numeric",
    });
    const formattedArrTime = arrTime.setLocale('en-us').toLocaleString({
        hour: "numeric",
        minute: "numeric",
    });

    return `${formattedDepTime} - ${formattedArrTime}`;
}
