import type { Metadata } from "next";
import { headers } from 'next/headers';
import { redirect } from "next/navigation";

// Components
import ResultsContent from "@/app/results/ResultsContent";

// Utils
import type { Direction } from '@prisma/client';
import { airportLocationMap, airportMap } from "@/lib/airports";
import { hostToConfig } from '@/lib/schools';
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
    { searchParams }: { searchParams: Partial<ResultsParams> }
): Promise<Metadata> {
    if (
        !searchParams.direction
        || !searchParams.extAirports
        || !searchParams.depDate
    ) return {}; // TODO?

    if (searchParams.direction !== 'toSchool' && searchParams.direction !== 'fromSchool')
        return {};

    const host = headers().get("Host");
    const config = hostToConfig(host);
    if (!config) return {};

    const extAirports = searchParams.extAirports.split(",");

    const from = searchParams.direction === 'fromSchool'
        ? config.name
        : airportCodesToLocationStr(extAirports)
    const to = searchParams.direction === 'fromSchool'
        ? airportCodesToLocationStr(extAirports)
        : config.name

    return {
        title: `${from} ↔ ${to} (${searchParams.depDate})`, // TODO
    };
}

export default async function Results(
    { searchParams }: { searchParams: Partial<ResultsParams> }
) {
    if (
        !searchParams.direction
        || !searchParams.extAirports
        || !searchParams.depDate
    ) redirect("/search");

    if (searchParams.direction !== 'toSchool' && searchParams.direction !== 'fromSchool')
        redirect("/search");

    const extAirports = searchParams.extAirports.split(",");
    if (!extAirports.length)
        redirect("/search");

    // Ensure there's a return date if round trip is selected.
    const roundTrip = searchParams.roundTrip === "true";
    if (roundTrip && !searchParams.retDate)
        redirect("/search");

    // Get the school for this search
    const host = headers().get("Host");
    const config = hostToConfig(host);
    if (!config)
        redirect("/search");

    const from = searchParams.direction === 'fromSchool'
        ? config.name
        : airportCodesToLocationStr(extAirports)
    const to = searchParams.direction === 'fromSchool'
        ? airportCodesToLocationStr(extAirports)
        : config.name

    // Fetch school from database for internal airports
    const school = await getSchoolByName(config.name);

    const fromAirports = searchParams.direction === 'fromSchool'
        ? school!.airportIatas
        : extAirports
    const toAirports = searchParams.direction === 'fromSchool'
        ? extAirports
        : school!.airportIatas

    const shuttleCheckboxes = Object.fromEntries(school!.shuttles.map(s => [s.id.toString(), {
        name: s.name,
        value: true,
        iconUrl: s.iconUrl,
        bookingUrl: s.bookingURL
    }]));

    const depRange = [searchParams.depRangeStart ? Number(searchParams.depRangeStart) : 0, searchParams.depRangeEnd ? Number(searchParams.depRangeEnd) : 1440];
    const arrRange = [searchParams.arrRangeStart ? Number(searchParams.arrRangeStart) : 0, searchParams.arrRangeStart ? Number(searchParams.arrRangeEnd) : 1440];

    const carryCnt = Number(searchParams.carryCnt); // TODO: validate
    const checkCnt = Number(searchParams.checkCnt);

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
                direction={searchParams.direction}
                intAirports={school!.airportIatas}
                extAirports={extAirports}
                depDate={searchParams.depDate}
                retDate={searchParams.retDate}

                depRange={depRange}
                arrRange={arrRange}

                carryCnt={carryCnt}
                checkCnt={checkCnt}
                schoolID={config.dbID}
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
