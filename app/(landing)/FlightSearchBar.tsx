'use client'

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import AirportSelector from '@/components/AirportSelector';

// Icons
import { FaCircleArrowRight, FaLocationDot } from 'react-icons/fa6';

// Utils
import type { Airport } from '@/lib/airports';


type FlightSearchBarProps = {
    airportLocs: [string, Airport[]][],
    host: string | null
}
export default function FlightSearchBar(props: FlightSearchBarProps) {
    const [dest, setDest] = useState(new Set<string>());

    const router = useRouter();
    function startSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push(`/search?to=${[...dest.values()].join(',')}`);
    }

    return (
        <form
            className="relative flex flex-wrap gap-3 pointer-events-auto"
            onSubmit={startSearch}
        >
            <div className="relative pl-10 bg-content rounded shadow-lg w-96 border border-tertiary">
                <FaLocationDot className="absolute left-3 text-primary text-lg inset-y-0 my-auto" />
                <AirportSelector
                    maxAirports={8}
                    airportLocs={props.airportLocs}
                    className="py-2.5 pl-0 pr-6" // focus-visible:ring-2
                    popoverClassname="left-[-2.6rem] top-12 w-[calc(100%_+_2.6rem)]"
                    placeholder="San Francisco, CA"
                    dest={dest}
                    setDest={setDest}
                    host={props.host}
                    onLanding
                />
                <button
                    className="flex sm:hidden absolute right-3 h-full mr-[2px] text-lg inset-y-0 my-auto text-theme disabled:opacity-50 transition duration-200"
                    disabled={dest.size === 0}
                    type="submit"
                >
                    <FaCircleArrowRight className="inset-y-0 my-auto" />
                </button>
            </div>

            <button
                className="hidden sm:flex px-4 py-2 rounded bg-theme disabled:opacity-50 text-white shadow-lg gap-2 items-center transition duration-200"
                disabled={dest.size === 0}
                type="submit"
            >
                Take me there
                <FaCircleArrowRight />
            </button>
        </form>
    )
}
