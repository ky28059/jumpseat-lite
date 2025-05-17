import type { Metadata } from "next";
import { cookies, headers } from 'next/headers';
import { redirect } from "next/navigation";

// Components
import ResultsContent from "@/app/results/ResultsContent";

// Utils
import type { Direction } from '@prisma/client';
import { SCHOOL_COOKIE_NAME } from '@/lib/config';
import { airportLocationMap, airportMap } from "@/lib/airports";
import { schoolToConfig } from '@/lib/schools';
import { getSchoolByName } from '@/lib/db/school';
import { auth } from "@/auth";


export type ResultsParams = {
    roundTrip: string, // "boolean"
    direction: Direction,

    extAirports: string, // comma separated IATA codes

    depDate: string,
    retDate?: string,
    depRangeStart?: string,
    depRangeEnd?: string,
    arrRangeStart?: string,
    arrRangeEnd?: string,
    carryCnt: string,
    checkCnt: string,
};

export async function generateMetadata(
    { searchParams }: { searchParams: Promise<Partial<ResultsParams>> }
): Promise<Metadata> {
    const params = await searchParams;

    if (
        !params.direction
        || !params.extAirports
        || !params.depDate
    ) return {}; // TODO?

    if (params.direction !== 'toSchool' && params.direction !== 'fromSchool')
        return {};

    const school = (await cookies()).get(SCHOOL_COOKIE_NAME)?.value;
    const config = schoolToConfig(school);
    if (!config) return {};

    const extAirports = params.extAirports.split(",");

    const from = params.direction === 'fromSchool'
        ? config.name
        : airportCodesToLocationStr(extAirports)
    const to = params.direction === 'fromSchool'
        ? airportCodesToLocationStr(extAirports)
        : config.name

    return {
        title: `${from} ↔ ${to} (${params.depDate})`, // TODO
    };
}

export default async function Results(
    { searchParams }: { searchParams: Promise<Partial<ResultsParams>> }
) {
    const params = await searchParams;

    if (
        !params.direction
        || !params.extAirports
        || !params.depDate
    ) redirect("/search");

    if (params.direction !== 'toSchool' && params.direction !== 'fromSchool')
        redirect("/search");

    const extAirports = params.extAirports.split(",");
    if (!extAirports.length)
        redirect("/search");

    // Ensure there's a return date if round trip is selected.
    const roundTrip = params.roundTrip === "true";
    if (roundTrip && !params.retDate)
        redirect("/search");

    // Get the school for this search
    const schoolId = (await cookies()).get(SCHOOL_COOKIE_NAME)?.value;
    const config = schoolToConfig(schoolId);
    if (!config)
        redirect("/search");

    const from = params.direction === 'fromSchool'
        ? config.name
        : airportCodesToLocationStr(extAirports)
    const to = params.direction === 'fromSchool'
        ? airportCodesToLocationStr(extAirports)
        : config.name

    // Fetch school from database for internal airports
    const school = await getSchoolByName(config.name);

    const fromAirports = params.direction === 'fromSchool'
        ? school!.airportIatas
        : extAirports
    const toAirports = params.direction === 'fromSchool'
        ? extAirports
        : school!.airportIatas

    const shuttleCheckboxes = Object.fromEntries(school!.shuttles.map(s => [s.id.toString(), {
        name: s.name,
        value: true,
        iconUrl: s.iconUrl,
        bookingUrl: s.bookingUrl
    }]));

    const depRange = [params.depRangeStart ? Number(params.depRangeStart) : 0, params.depRangeEnd ? Number(params.depRangeEnd) : 1440];
    const arrRange = [params.arrRangeStart ? Number(params.arrRangeStart) : 0, params.arrRangeStart ? Number(params.arrRangeEnd) : 1440];

    const carryCnt = Number(params.carryCnt); // TODO: validate
    const checkCnt = Number(params.checkCnt);

    const session = await auth();
    const userID = session?.user.id ? Number(session.user.id) : undefined;

    return (
        <div className="container pt-28 pb-16">
            <ResultsContent
                roundTrip={roundTrip}
                from={from}
                to={to}

                fromAirports={airportCodesToCheckboxObjs(fromAirports)}
                toAirports={airportCodesToCheckboxObjs(toAirports)}
                shuttleProviders={shuttleCheckboxes}
                airportMap={airportMap}

                school={config.name}
                direction={params.direction}
                intAirports={school!.airportIatas}
                extAirports={extAirports}
                depDate={params.depDate}
                retDate={params.retDate}

                depRange={depRange}
                arrRange={arrRange}

                carryCnt={carryCnt}
                checkCnt={checkCnt}
                userID={userID}
            />
        </div>
    );
}

function airportCodesToLocationStr(codes: string[]) {
    const s = new Set(codes);

    // If all given codes belong to the same city, return the city name.
    const loc = Object.entries(airportLocationMap).find(([, airports]) => {
        const iatas = new Set(airports.map((a) => a.iata));
        return codes.every((c) => iatas.has(c));
    });
    if (loc) return loc[1][0].city;

    // Otherwise, the best we can do is list the airport codes.
    return codes.join(", ");
}

function airportCodesToCheckboxObjs(codes: string[]) {
    const ret: { [code: string]: { name: string, value: boolean } } = {};

    for (const code of codes) {
        const airport = airportMap[code];
        if (!airport) redirect("/search");

        ret[code] = { name: `${airport.name} (${airport.iata})`, value: true };
    }

    return ret;
}
