import type { Metadata } from "next";
import { cookies, headers } from "next/headers";

// Components
import InfoBox from "@/app/search/InfoBox";
import SearchBoxMap from "@/app/search/SearchBoxMap";

// Icons
import { BiSolidPlaneAlt } from "react-icons/bi";
import { FaBus, FaUserFriends } from "react-icons/fa";

// Utils
import { getBreaksBySchoolName } from "@/lib/db/school";
import { schoolToConfig } from "@/lib/schools";
import { SCHOOL_COOKIE_NAME, THEME_COOKIE_NAME } from "@/lib/config";
import { airportLocationMap, airportMap } from "@/lib/airports";
import { auth } from "@/auth";
import prisma from "@/lib/db/prisma";


export const metadata: Metadata = {
    title: "Search",
};

export default async function Search({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
    const params = await searchParams;
    const c = await cookies();

    const school = c.get(SCHOOL_COOKIE_NAME)?.value;
    const config = schoolToConfig(school);
    const theme = c.get(THEME_COOKIE_NAME)?.value;

    // Fetch break dates for the given school.
    // TODO: default to not purdue?
    const breaks = await getBreaksBySchoolName(config?.name ?? "Purdue");

    // Load prefilled destination airports:
    // - If there are search params set, use those first.
    // - Otherwise, try to load the user's home airports.
    async function getPrefilledToDest() {
        if (params.to) return new Set(params.to.split(","));

        const session = await auth();
        if (!session?.user.id) return;

        const user = await prisma.user.findUnique({
            where: { id: Number(session.user.id) },
        });
        if (!user) return;

        return new Set(user.airports);
    }

    // TODO: default lat / long?
    const [lat, lng] = config?.coordinates ?? [40.4237095, -86.9237695];

    return (
        <main className="pt-28 pb-20 w-full max-w-6xl sm:box-content px-5 sm:px-8 mx-auto">
            <h1 className="font-semibold text-2xl mb-6">
                Find your trip
            </h1>
            <SearchBoxMap
                breaks={breaks}
                config={config}
                defaultDest={await getPrefilledToDest()}
                school={school}
                airportMap={airportMap}
                airportLocationMap={airportLocationMap}
                theme={theme}
            />
            <div className="flex flex-col sm:flex-row justify-between w-full sm:mt-16 mt-8 gap-10">
                <InfoBox
                    title="Shuttles Included"
                    description="You don’t need to flip through a dozen tabs to line up shuttles with your flights."
                    icon={FaBus}
                />
                <InfoBox
                    title="The same flights"
                    description="We have all the flights that Google Flights, Kayak, and Expedia do."
                    icon={BiSolidPlaneAlt}
                />
                <InfoBox
                    title="Save time"
                    description="Don’t waste time booking or let travel time cut into your break."
                    icon={FaUserFriends}
                />
            </div>
        </main>
    );
}
