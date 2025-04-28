"use client";

import { useState } from "react";

// Components
import SearchBox from "@/app/search/SearchBox";
import Map from "@/components/map";

// Utils
import type { SchoolConfig } from "@/lib/schools";
import type { Airport } from "@/lib/airports";
import { Break, Direction } from "@prisma/client";


type SearchBoxMapProps = {
    breaks: Break[],
    defaultDest?: Set<string>,
    host: string | null,
    config: SchoolConfig | undefined,
    airportLocationMap: { [loc: string]: Airport[] },
    airportMap: { [iata: string]: Airport },
    theme: string | undefined
}

export default function SearchBoxMap({
    breaks,
    defaultDest,
    host,
    config,
    airportLocationMap,
    airportMap,
    theme,
}: SearchBoxMapProps) {
    const [lat, lng] = config?.coordinates ?? [40.4237095, -86.9237695];

    function destToCoordinates(dest: Set<string>) {
        return [...dest].map((destinationIATA) => {
            const destinationAirport = airportMap[destinationIATA];
            return [{ lat, lng }, { lat: destinationAirport.lat, lng: destinationAirport.lon }];
        })
    }

    const [dest, setDest] = useState(defaultDest ?? new Set<string>());
    const [flightPathCoordinates, setFlightPathCoordinates] = useState(destToCoordinates(dest));
    const [direction, setDirection] = useState<Direction>('fromSchool');

    const handleChangeDest = (newDest: Set<string>) => {
        setDest(newDest);
        setFlightPathCoordinates(destToCoordinates(newDest));
    }

    return (
        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full h-fit">
            <SearchBox
                airportLocs={Object.entries(airportLocationMap)}
                breakDates={breaks}
                dest={dest}
                host={host}
                setDest={handleChangeDest}
                direction={direction}
                setDirection={setDirection}
            />
            <div className="border rounded-md w-full overflow-hidden min-h-[100px]">
                <Map
                    center={{ lat, lng }}
                    flightPlanCoordinates={flightPathCoordinates}
                    direction={direction}
                    theme={theme}
                />
            </div>
        </div>
    )
}
