'use client'

import { useState } from 'react';

// Components
import AirportSelector from '@/components/AirportSelector';

// Utils
import type { Airport } from '@/lib/airports';
import { updateProfile } from '@/lib/db/user';

// Icons
import { BiSolidPlaneAlt } from 'react-icons/bi';
import { FaPencil } from 'react-icons/fa6';


type HomeAirportSelectorProps = {
    airports: Set<string>,
    airportLocs: [string, Airport[]][],
    schoolAirports?: string[],
    host: string | null
}
export default function HomeAirportSelector(props: HomeAirportSelectorProps) {
    const [iatas, setIatas] = useState(props.airports);
    const [editingAirport, setEditingAirport] = useState(false);

    const airports = props.airportLocs
        .flatMap(([, airports]) => airports)
        .filter(a => iatas.has(a.iata))

    // Toggles airport editing, updating the db when a user stops editing.
    async function toggleEditing() {
        setEditingAirport(!editingAirport);
    }

    function setWrapper(input: Set<string>) {
        setIatas(input);
        updateProfile('airports', [...iatas])
    }

    return (
        <div className="flex">
            <BiSolidPlaneAlt size={32} className="mt-2" />
            <div className="w-72 ml-3">
                <p className="text-sm font-medium mb-0.5">
                    Home Airport(s)
                </p>

                {editingAirport ? (
                    <AirportSelector
                        dest={iatas}
                        setDest={setWrapper}
                        placeholder="Search"
                        className="py-1.5"
                        airportLocs={props.airportLocs}
                        host={props.host}
                    />
                ) : airports.length === 0 ? (
                    <p className="text-secondary">
                        No home airport selected.
                    </p>
                ) : (
                    <div className="flex flex-col flex-grow gap-1">
                        {airports.map(a => (
                            <div className="rounded-md px-2 py-0.5 bg-theme/30 text-theme text-sm font-semibold">
                                {a.name} ({a.iata})
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <FaPencil
                onClick={toggleEditing}
                className="cursor-pointer ml-2.5 mt-6"
            />
        </div>
    )
}
