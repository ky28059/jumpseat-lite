"use client";

import { useContext } from "react";

// Utils
import type { Combo } from "@/app/results/ComboCard";
import ResultsContext from "@/contexts/ResultsContext";

// Icons
import { MdLocationOn } from "react-icons/md";
import { FaCheck, FaVanShuttle, FaX } from "react-icons/fa6";
import { IoBag } from "react-icons/io5";


type ShuttleBookingDetailProps = {
    combo: Combo,
    shuttleIndex: number,
    return?: boolean,
    addedPrice?: number
};
export default function ShuttleBookingDetail(props: ShuttleBookingDetailProps) {
    const { filter, direction, school } = useContext(ResultsContext);

    const addedPrice = props.addedPrice ?? 0;

    const shuttle = props.combo.shuttleOptions[props.shuttleIndex];
    const provider = filter.shuttles[shuttle.providerID.toString()];

    const origin = (direction === 'fromSchool' && !props.return)
        ? school
        : props.combo.itinerary.flights.at(-1)!.arrival_airport.id;
    const dest = (direction === 'fromSchool' && !props.return)
        ? props.combo.itinerary.flights[0].departure_airport.id
        : school;

    return (
        <div className="flex flex-col p-3 w-full border rounded-lg border-tertiary text-sm sm:px-5 shadow">
            <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
                <FaVanShuttle size={24} className="text-blue-500" />

                <div className="flex flex-col gap-1 flex-grow">
                    <h2 className="font-medium text-sm sm:text-base flex gap-2 items-center ml-1">
                        Book with {provider.name}
                    </h2>

                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-5 text-secondary">
                        <div className="flex flex-row items-center gap-1 text-xs">
                            <MdLocationOn size={16} className="text-amber-500" />
                            {origin} {"->"} {dest}
                            {addedPrice != 0 ? `,\n ${dest} -> ${origin}` : ""}
                        </div>
                        {/*
                        <div className="flex items-center gap-1 w-36">
                            {props.together.baggage_prices[0].includes('No') ? (
                                <FaX size={15} className="text-red-500" />
                            ) : (
                                <FaCheck size={15} className="text-lime-500" />
                            )}
                            {props.together.baggage_prices[0]}
                        </div>
                        <div className="flex items-center gap-1">
                            <IoBag size={15} className="text-red-400" />
                            {props.together.baggage_prices[1]}
                        </div>
                        */}
                    </div>
                </div>

                <div className="flex items-center gap-3 text-sm sm:text-base">
                    <img
                        className="flex-none size-8 sm:size-10 object-contain object-center border border-tertiary bg-white rounded-full"
                        src={provider.iconUrl ?? ""} // TODO
                        alt={provider.name}
                    />

                    <button
                        className="bg-blue-500 text-center w-fit self-center rounded-md text-white text-sm px-3 py-2 font-medium transition hover:opacity-80 disabled:opacity-50"
                        onClick={() => window.open(provider.bookingUrl)}
                    >
                        ${shuttle.price + addedPrice}
                    </button>
                </div>
            </div>
        </div>
    );
}
