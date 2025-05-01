"use client";

import { useContext, useEffect, useState } from "react";

// Utils
import { BookingOption, getBookingHref } from "@/lib/search/serp";
import ResultsContext from "@/contexts/ResultsContext";

// Components
import HackerFareModal from "./HackerFareModal";

// Icons
import { MdAirplanemodeActive, MdLocationOn } from "react-icons/md";
import { FaCheck, FaX } from "react-icons/fa6";
import { IoBag } from "react-icons/io5";


export default function BookingDetail(props: BookingOption) {
    const { roundTrip, depCombo, retCombo } = useContext(ResultsContext);
    const [href, setHref] = useState<string | undefined>(undefined);

    const [hackerFareDeparture, setHackerFareDeparture] = useState<string>("");
    const [hackerFareReturn, setHackerFareReturn] = useState<string>("");
    const [hackerFareModalIsOpen, setHackerFareModalIsOpen] = useState<boolean>(false);

    const isSeparate = props.separate_tickets;

    // Fetch the Google Flights link to the booking, where the returned original redirect page looks like
    // `<html><head><meta content="0;url='https://www.spirit.com/book/flights?bookingType=flight&amp;orgCode=6826515426&amp;adt=1&amp;chd=0&amp;inf=0&amp;tripType=roundTrip&amp;from=ORD&amp;to=EWR&amp;departDate=09/07/2024&amp;returnDate=09/13/2024&amp;fromFlightNumber=328&amp;toFlightNumber=329'" http-equiv="refresh"></head><body></body></html>`
    useEffect(() => {
        if (isSeparate) {
            getBookingHref(props.departing?.booking_request!).then((href) => setHackerFareDeparture(href!));
            getBookingHref(props.returning?.booking_request!).then((href) => setHackerFareReturn(href!));
        } else {
            getBookingHref(props.together.booking_request).then((href) => setHref(href));
        }
    }, []);

    return (
        <div className="flex flex-col p-3 w-full border rounded-lg border-tertiary text-sm sm:px-5 shadow">
            {isSeparate && (
                <HackerFareModal
                    isOpen={hackerFareModalIsOpen}
                    setIsOpen={setHackerFareModalIsOpen}
                    hackerFareLinks={[hackerFareDeparture, hackerFareReturn]}
                />
            )}

            <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
                <MdAirplanemodeActive size={24} className="text-blue-500" />

                <div className="flex flex-col gap-1 flex-grow">
                    <h2 className="font-medium text-sm sm:text-base flex gap-2 items-center">
                        Book with {props.together.book_with}
                        {props.together.option_title && (
                            <span className="text-secondary font-normal text-sm">({props.together.option_title})</span>
                        )}
                    </h2>

                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-5 text-secondary">
                        <div className="flex flex-row items-center gap-1 text-sm sm:text-base">
                            <MdLocationOn size={16} className="text-amber-500" />

                            {depCombo?.itinerary.flights[0].departure_airport.id}
                            {roundTrip ? " <-> " : " -> "}
                            {depCombo?.itinerary.flights.at(-1)!.arrival_airport.id}
                        </div>
                        {props.together.baggage_prices && props.together.baggage_prices.length > 0 && (
                            <div className="flex items-center gap-1 w-40 text-sm sm:text-base">
                                {props.together.baggage_prices[0].includes("No") ? (
                                    <FaX size={15} className="text-red-500" />
                                ) : (
                                    <FaCheck size={15} className="text-lime-500" />
                                )}
                                {props.together.baggage_prices[0]}
                            </div>
                        )}
                        {props.together.baggage_prices && props.together.baggage_prices.length > 1 && (
                            <div className="flex items-center gap-1 text-sm sm:text-base">
                                <IoBag size={15} className="text-red-400" />
                                {props.together.baggage_prices[1]}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 text-sm sm:text-base">
                    <img
                        className="flex-none size-8 sm:size-10 object-contain object-center border border-tertiary bg-white rounded-full"
                        src={props.together.airline_logos[0]}
                        alt={props.together.book_with}
                    />
                    {isSeparate ? (
                        <button
                            className="bg-blue-500 text-center w-fit self-center rounded-md text-white px-3 py-2 font-medium transition hover:opacity-80 disabled:opacity-50"
                            disabled={!hackerFareDeparture || !hackerFareReturn}
                            onClick={() => setHackerFareModalIsOpen(true)}
                        >
                            ${props.together.price}
                        </button>
                    ) : (
                        <button
                            className="bg-blue-500 text-center w-fit self-center rounded-md text-white px-3 py-2 font-medium transition hover:opacity-80 disabled:opacity-50"
                            disabled={!href}
                            onClick={() => window.open(href)}
                        >
                            ${props.together.price}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
