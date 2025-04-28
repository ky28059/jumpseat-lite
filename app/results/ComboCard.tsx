"use client";

import { useContext, useRef, useState } from "react";

// Components
import ShuttleLogo from "@/app/results/ShuttleLogo";
import { Timeline as ItineraryTimeline } from "@/app/results/Timeline";
import FormattedTimeRange from "@/app/search/FormattedTimeRange";

// Utils
import type { ShuttleTime, SortType } from "@prisma/client";
import type { Itinerary } from "@/lib/search/serp";
import {
    calculateComboTimes,
    calculateShuttleTimes,
    formatDateTimesMed,
    formatDateTimesShort,
    formatMinutesMed,
    formatMinutesShort,
    formatTimeRange
} from "@/lib/time";
import { cn } from "@/lib/utils";
import { writeSelectedCombo } from "@/lib/db/analytics";

// Contexts
import ResultsContext, { ResultsStage } from "@/contexts/ResultsContext";

// Icons
import { FaArrowRight, FaChevronDown, FaPlane, FaShuttleVan } from "react-icons/fa";
import { LuClock4 } from "react-icons/lu";
import { MdAirportShuttle } from "react-icons/md";
import { IoAirplane } from "react-icons/io5";


export type ShuttleOption = ShuttleTime & {
    relevantTime?: Date,
    airportWait?: number
};

export type Combo = {
    itinerary: Itinerary,
    shuttleOptions: ShuttleOption[],
    comboID?: number
};

type ComboCardProps = {
    combo: Combo,

    setCombo?: (c: Combo) => void,
    shuttleIndex?: number,
    setShuttleIndex?: (i: number) => void,

    finalize?: boolean,
    firstShuttlePrice?: number,
    sortType?: SortType
};
export default function ComboCard(props: ComboCardProps) {
    const { school, filter, airportMap, direction, roundTrip, stage, analyticsID } = useContext(ResultsContext);
    const { itinerary, shuttleOptions } = props.combo;

    const [expanded, setExpanded] = useState(false);
    const [selectedShuttleIndex, setSelectedShuttleIndex] = useState(props.shuttleIndex ?? 0);

    const [scrollPosition, setScrollPosition] = useState({ scrollLeft: 0 });
    const scrollDemoRef = useRef<HTMLDivElement>(null);

    // When this combo card is selected, set the combo and selected shuttle
    function onSelect() {
        props.setCombo && props.setCombo(props.combo);
        props.setShuttleIndex && props.setShuttleIndex(selectedShuttleIndex);
        if (process.env.NODE_ENV !== "development")
            writeSelectedCombo(props.combo.comboID ?? -1, props.combo.shuttleOptions[selectedShuttleIndex].id, props.combo, direction, props.sortType!, analyticsID);
    }

    const handleScroll = () => {
        if (scrollDemoRef.current) {
            const { scrollLeft } = scrollDemoRef.current;
            setScrollPosition({ scrollLeft });
        }
    };

    const getBoxShadowClass = () => {
        if (scrollPosition.scrollLeft > 0 && scrollPosition.scrollLeft < 31) {
            return "shadow-inset-both dark:shadow-inset-both-dark";
        } else if (scrollPosition.scrollLeft > 0) {
            return "shadow-inset-right dark:shadow-inset-right-dark";
        } else {
            return "shadow-inset-left dark:shadow-inset-left-dark";
        }
    };

    // Calculate relevant times to display on card
    const shuttle = shuttleOptions[selectedShuttleIndex];
    const {
        start,
        end,
        flightDepTime,
        flightArrTime,
        shuttleDepTime,
        shuttleArrTime,
        shuttleBefore,
        shuttleWaitMinutes,
    } = calculateComboTimes(itinerary, shuttle, airportMap);

    const flightOrigin = itinerary.flights[0].departure_airport;
    const flightDest = itinerary.flights.at(-1)!.arrival_airport;

    // Long "pretty-print" strings for the origin and destination airports
    const flightOriginLong = `${flightOrigin.name} (${flightOrigin.id})`;
    const flightDestLong = `${flightDest.name} (${flightDest.id})`;

    const flightLayoverDuration = itinerary.layovers?.reduce((a, b) => a + b.duration, 0) ?? 0;

    return (
        <div
            className={`group relative p-3 md:p-6 rounded-md shadow-lg bg-content md:w-[725px] cursor-default border border-tertiary ${
                expanded ? "md:h-[460px] h-[302px]" : "md:h-[165px] h-[170px] hover:cursor-pointer"
            } flex flex-col items-center transition-[height] duration-300 overflow-y-clip`}
            onClick={() => !expanded && setExpanded(true)}
        >
            <div
                className="flex flex-row items-center justify-between w-full h-[90%] max-h-[103px]"
                onClick={() => expanded && setExpanded(false)}
            >
                <div className="sm:w-[17rem] w-[15rem] flex-none grid grid-cols-[26px_1fr] md:grid-cols-[45px_1fr] gap-x-2 gap-y-3">
                    <img
                        className="size-[26px] md:size-[45px] object-contain object-center rounded border border-tertiary bg-white"
                        src={itinerary.airline_logo}
                        loading="lazy"
                        alt="airline logo"
                    />
                    <div>
                        <FormattedTimeRange
                            depTime={flightDepTime}
                            arrTime={flightArrTime}
                            className="text-sm md:text-base font-medium"
                        />

                        <div className="hidden md:flex items-center gap-1">
                            {/*
                            <div className="flex items-center rounded-full bg-blue-500 p-[3px]">
                                <IoAirplane size={12} className="-rotate-90 text-content" />
                            </div>
                            */}
                            <p className="text-secondary text-xs">{itinerary.flights[0].airline}</p>
                        </div>
                    </div>

                    <ShuttleLogo
                        name={filter.shuttles[shuttle.providerID.toString()].name}
                        src={filter.shuttles[shuttle.providerID.toString()].iconUrl}
                        className={cn(
                            "size-[26px] md:size-[45px] object-contain object-center rounded border border-tertiary bg-white",
                            shuttleBefore && "-order-1"
                        )}
                    />
                    <div className={cn(shuttleBefore && "-order-1")}>
                        <FormattedTimeRange
                            depTime={shuttleDepTime}
                            arrTime={shuttleArrTime}
                            className="text-sm md:text-base font-medium"
                        />

                        <div className="hidden md:flex flex-row items-center gap-1">
                            {/*
                            <div className="flex items-center rounded-full bg-gray-400 p-[3px]">
                                <FaShuttleVan size={12} className="text-content" />
                            </div>
                            */}
                            <p className="text-secondary text-xs">
                                {filter.shuttles[shuttle.providerID.toString()].name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={cn("hidden md:flex gap-10", shuttleBefore ? "flex-col-reverse" : "flex-col")}>
                    <ItineraryTimeline
                        origin={flightOrigin.id}
                        destination={flightDest.id}
                        layover={itinerary.layovers?.[0]?.id} // TODO
                        layoverDuration={formatMinutesShort(flightLayoverDuration)}
                        time={formatDateTimesShort(flightDepTime, flightArrTime)}
                        type="flight"
                        direction={direction}
                        stage={stage}
                    />
                    <ItineraryTimeline
                        origin={shuttleBefore ? school : flightDest.id}
                        destination={shuttleBefore ? flightOrigin.id : school}
                        time={formatDateTimesShort(shuttleDepTime, shuttleArrTime)}
                        type="shuttle"
                        direction={direction}
                        stage={stage}
                    />
                </div>

                <div
                    className={cn(
                        "hidden md:flex justify-between w-[86px] ml-4 h-full -mr-1",
                        shuttleBefore ? "flex-col-reverse" : "flex-col"
                    )}
                >
                    <div>
                        <p className="text-sm font-medium">
                            {itinerary.layovers ? `${itinerary.layovers.length} stop${itinerary.layovers.length !== 1 ? 's' : ''}` : "nonstop"}
                        </p>
                        {itinerary.layovers && ( // TODO
                            <p className="text-secondary text-[9px]">
                                {formatMinutesMed(itinerary.layovers[0].duration)} {itinerary.layovers[0].id}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {formatMinutesMed(shuttleWaitMinutes)}
                        </p>
                        <p className="text-secondary text-[9px]">Airport Wait Time</p>
                    </div>
                </div>
                {!props.finalize && (
                    <div className="md:bg-gradient-to-r from-blue-800 dark:from-blue-600 !to-blue-500 p-[2px] rounded-md min-w-[95px] h-[120px]">
                        <div className="flex flex-col justify-center md:justify-between h-full rounded-sm w-full p-2 bg-content">
                            <div className="flex flex-col text-end items-end">
                                <p className="text-lg font-semibold bg-gradient-to-r from-blue-800 dark:from-blue-600 !to-blue-500 inline-block text-transparent bg-clip-text">
                                    ${stage == ResultsStage.DEPARTURE ? itinerary.price + shuttle.price * (roundTrip ? 2 : 1): itinerary.price + shuttle.price + props.firstShuttlePrice!}
                                </p>
                                <p className="text-secondary text-[9px]">Economy</p>
                                <p className="text-secondary text-[9px]">{roundTrip ? "Round trip" : "One way"} price</p>
                                <p className="text-secondary text-[9px]">w/ shuttle{roundTrip ? "s" : ""}</p>
                                {/*<p className="text-secondary text-[9px]">United.com</p>*/}
                            </div>
                            <button
                                className="hidden md:block bg-gradient-to-r from-blue-800 dark:from-blue-600 !to-blue-500 text-center w-full self-center rounded-md text-white text-[10px] py-1 font-medium cursor-pointer hover:opacity-80"
                                onClick={onSelect}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div
                className="md:hidden flex flex-row justify-between items-center gap-1 pt-2 w-full border-t-[1px] border-tertiary"
                onClick={() => setExpanded(!expanded)}
            >
                <div className={cn("flex justify-between", shuttleBefore ? "flex-col-reverse" : "flex-col")}>
                    <p className="text-xs">{itinerary.flights[0].airline}</p>
                    <p className="text-xs">{filter.shuttles[shuttle.providerID.toString()].name}</p>
                </div>
                <div>
                    <p className="text-xs font-medium">
                        {itinerary.layovers ? `${itinerary.layovers.length} stop${itinerary.layovers.length !== 1 ? 's' : ''}` : "nonstop"}
                    </p>
                    {itinerary.layovers && (
                        <p className="text-secondary text-[9px]">
                            {formatMinutesMed(itinerary.layovers[0].duration)} {itinerary.layovers[0].id}
                        </p>
                    )}
                </div>
                <div>
                    <p className="text-xs font-medium text-pretty">
                        {formatMinutesMed(shuttleWaitMinutes)}
                    </p>
                    <p className="text-secondary text-[9px]">Airport Wait Time</p>
                </div>
            </div>
            {expanded && <hr className="w-full border-tertiary mt-2 md:mt-8 rounded-full mb-2 md:mb-5" />}
            {expanded && (
                <div className="hidden md:flex justify-between w-full">
                    <p className="font-semibold">
                        Travel time: {formatDateTimesMed(start, end)}
                    </p>
                    <div className="flex gap-1 items-center font-medium">
                        Departs {start.toFormat('ccc, LLL d')}
                    </div>
                </div>
            )}
            {expanded && (
                <div className={cn("hidden md:flex w-full mt-3 gap-2 text-sm", shuttleBefore ? "flex-col" : "flex-col-reverse")}>
                    <TravelDisplay
                        origin={shuttleBefore ? school : flightDestLong}
                        destination={shuttleBefore ? flightOriginLong : school}
                        time={formatTimeRange(shuttleDepTime, shuttleArrTime)}
                        type="shuttle"
                    />
                    <WaitDisplay
                        location={shuttleBefore ? flightOriginLong : flightDestLong}
                        time={formatMinutesMed(shuttleWaitMinutes)}
                    />
                    <TravelDisplay
                        origin={flightOriginLong}
                        destination={flightDestLong}
                        time={formatTimeRange(flightDepTime, flightArrTime)}
                    />
                </div>
            )}
            {expanded && (
                <div className="flex-col w-full md:mt-5">
                <h3 className="font-semibold mb-1 text-sm md:text-base">Choose a shuttle</h3>
                    <div className="relative">
                        <div className={`absolute w-full h-[80%] self-center pointer-events-none ${getBoxShadowClass()}`} />
                        <div
                            className="flex flex-row w-full gap-2 md:max-w-[860px] overflow-x-auto scrollbar-thin pb-1"
                            ref={scrollDemoRef}
                            onScroll={handleScroll}
                        >
                            {shuttleOptions.map((s, i) => {
                                const { shuttleDepTime: sd, shuttleArrTime: sa } = calculateShuttleTimes(s, flightDepTime, flightArrTime);
                                return (
                                    <ShuttleOption
                                        key={i}
                                        selected={i === selectedShuttleIndex}
                                        onClick={() => setSelectedShuttleIndex(i)}
                                        disabled={props.finalize}
                                        provider={filter.shuttles[s.providerID.toString()].name}
                                        price={s.price}
                                        time={formatTimeRange(sd, sa)}
                                        duration={formatDateTimesShort(sd, sa)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <button
                        className="flex md:hidden bg-theme text-center w-fit rounded-md text-white text-[10px] py-1 px-4 font-medium mt-1 ml-auto"
                        onClick={onSelect}
                    >
                        Select
                    </button>
                </div>
            )}
            <div
                className="hidden md:flex flex-row gap-1 opacity-0 group-hover:opacity-100 absolute bottom-0 rounded-t-md items-center justify-center bg-secondary/75 text-white w-[120px] py-[2px] hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                {!expanded && <p className="text-[9px]">See more shuttles</p>}
                <FaChevronDown size={12} className={`${expanded ? "rotate-180" : ""}`} />
            </div>
        </div>
    );
}

type TravelDisplayProps = {
    time: string,
    origin: string,
    destination: string,
    type?: "flight" | "shuttle"
};

export function TravelDisplay({ time, origin, destination, type = "flight" }: TravelDisplayProps) {
    return (
        <div className="flex flex-row w-full">
            <div className="flex flex-row items-center gap-2 min-w-[30%]">
                {type === "flight" && <FaPlane size={16} />}
                {type === "shuttle" && <MdAirportShuttle size={16} />}
                <p className="">{time}</p>
            </div>
            <p className="text-secondary">
                {origin.replaceAll("International", "Intl").replaceAll("Airport", "")}
                {" -> "}
                {destination.replaceAll("International", "Intl").replaceAll("Airport", "")}
            </p>
        </div>
    );
}

type WaitDisplayProps = {
    time: string,
    location: string
};

export function WaitDisplay({ time, location }: WaitDisplayProps) {
    return (
        <div className="flex w-full">
            <div className="flex items-center gap-2 min-w-[30%]">
                <LuClock4 size={16} />
                <p>{time}</p>
            </div>
            <p className="text-secondary">
                Wait in {location}
            </p>
        </div>
    );
}

type ShuttleOptionProps = {
    provider: string,
    price: number,
    time: string,
    duration: string,
    selected?: boolean,

    onClick: () => void,
    disabled?: boolean
};

function ShuttleOption({ provider, price, time, duration, selected, ...buttonProps }: ShuttleOptionProps) {
    return (
        <button
            className={cn(
                "flex-none flex flex-col justify-between p-2 md:p-3 gap-1 rounded-md md:min-w-52 md:min-h-16 border border-tertiary dark:border-secondary transition duration-200 disabled:opacity-75",
                selected ? "bg-theme text-white" : "bg-content hover:bg-secondary/30"
            )}
            {...buttonProps}
        >
            <div className="flex justify-between w-full items-center">
                <p className="text-xs md:text-sm">{provider}</p>
                <p className="text-sm md:text-base font-medium">${price}</p>
            </div>
            <div className="flex justify-between w-full items-center gap-3 md:gap-4">
                <p className="text-sm md:text-base font-semibold">{time}</p>
                <p className="text-xs md:text-sm">{duration}</p>
            </div>
        </button>
    );
}
