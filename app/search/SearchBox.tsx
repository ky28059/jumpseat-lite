"use client";

import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TimeValue } from "react-aria";
import { DateRange } from "react-day-picker";
import { addDays, formatDate } from "date-fns";

// Components
import TypePicker from "@/components/TypePicker";
import AirportSelector from "@/components/AirportSelector";
import SwapButton from "@/app/search/SwapButton";
import BagPicker from "@/components/BagPicker";
import SchoolSelector from "@/components/SchoolSelector";
import { DatePicker } from "@/app/search/DatePicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/app/search/DateRangePicker";

// Icons
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

// Utils
import type { ResultsParams } from "@/app/results/page";
import type { Airport } from "@/lib/airports";
import { Break, BreakType, Direction } from "@prisma/client";
import { cn } from "@/lib/utils";
import { hostToConfig } from "@/lib/schools";
import { convertTimezone } from "@/app/autopilot/AutopilotContent";

type SearchBoxProps = {
    breakDates: Break[];
    airportLocs: [string, Airport[]][];
    dest: Set<string>;
    host: string | null;
    setDest: (newDest: Set<string>) => void;
    direction: Direction;
    setDirection: (arg0: Direction) => void;
};
export default function SearchBox(props: SearchBoxProps) {
    const config = hostToConfig(props.host);
    const [numCarryOn, setNumCarryOn] = useState(0);
    const [numCheckIn, setNumCheckIn] = useState(0);

    const [tripType, setTripType] = useState("Round trip");

    const [depDate, setDepDate] = useState<Date>();
    const [arrDate, setArrDate] = useState<Date>();
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 20),
        to: addDays(new Date(2024, 0, 20), 20),
    });

    const [scrollPosition, setScrollPosition] = useState({ scrollLeft: 0 });
    const scrollDemoRef = useRef<HTMLDivElement>(null);

    const initialBreakOption = getNextDate(props.breakDates);
    const [breakOption, setBreakOption] = useState<BreakType | "custom">(initialBreakOption);

    const handleScroll = () => {
        if (scrollDemoRef.current) {
            const { scrollLeft } = scrollDemoRef.current;
            setScrollPosition({ scrollLeft });
        }
    };

    const scroll = (scrollOffset: number) => {
        if (scrollDemoRef.current) {
            if (scrollDemoRef.current.scrollLeft !== undefined) {
                scrollDemoRef.current.scrollLeft += scrollOffset;
            }
        }
    };

    const getBoxShadowClass = () => {
        if (scrollPosition.scrollLeft > 0 && scrollPosition.scrollLeft < 298) {
            return "shadow-inset-both dark:shadow-inset-both-dark";
        } else if (scrollPosition.scrollLeft > 0) {
            return "shadow-inset-right dark:shadow-inset-right-dark";
        } else {
            return "shadow-inset-left dark:shadow-inset-left-dark";
        }
    };

    const router = useRouter();

    function search() {
        if (!config || !props.dest.size || !depDate) return;
        if (tripType === "Round trip" && !arrDate) return;

        const params: ResultsParams = {
            roundTrip: String(tripType === "Round trip"), // TODO?
            direction: props.direction,
            extAirports: [...props.dest.values()].join(","),
            depDate: tripType == "One way" ? depDate.toISOString().slice(0, 10) : date?.from?.toISOString().slice(0, 10)!,
            carryCnt: String(numCarryOn),
            checkCnt: String(numCheckIn)
        };
        if (tripType == "Round trip") params.retDate = date?.to!.toISOString().slice(0, 10);

        router.push(`/results?${new URLSearchParams(params)}`);
    }

    const swapped = props.direction === "toSchool";

    function toggleDirection() {
        if (props.direction === "toSchool") props.setDirection("fromSchool");
        else props.setDirection("toSchool");
    }

    useEffect(() => {
        if (initialBreakOption !== "custom") {
            const nextBreak = props.breakDates.find((date) => date.breakType === initialBreakOption);
            if (nextBreak) {
                setDate({ from: convertTimezone(nextBreak.defaultStartDate), to: convertTimezone(nextBreak.defaultEndDate) });
                setDepDate(convertTimezone(nextBreak.defaultStartDate));
                setArrDate(convertTimezone(nextBreak.defaultEndDate));
            }
        }
    }, [props.breakDates, initialBreakOption]);

    return (
        // className="flex flex-col gap-4 w-fit border rounded-md shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] p-6"
        <div className="container flex flex-col sm:min-w-[610px] gap-4 p-6 transition-[height] duration-300 shadow-[0_35px_60px_-15px_rgba(0,_0,_0,_0.1)] border border-tertiary/75 rounded-md">
            <div className="flex sm:flex-row flex-col justify-between gap-3">
                <div className="relative flex min-w-0">
                    <div className={`absolute w-full h-[80%] self-center pointer-events-none ${getBoxShadowClass()}`} />
                    <Tabs
                        value={breakOption}
                        className="min-w-0 overflow-x-auto scrollbar:hidden scroll-smooth"
                        ref={scrollDemoRef}
                        onScroll={handleScroll}
                    >
                        <TabsList className="bg-transparent px-0 rounded-none gap-2">
                            <TabsTrigger
                                value="custom"
                                onClick={() => {
                                    const threeDaysFromNow = new Date();
                                    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
                                    const tenDaysFromNow = new Date(threeDaysFromNow)
                                    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 7);
                                    setBreakOption("custom")
                                    setDate({ from: threeDaysFromNow, to: tenDaysFromNow });
                                    setDepDate(threeDaysFromNow);
                                    setArrDate(tenDaysFromNow);
                                }}
                            >
                                Custom
                            </TabsTrigger>

                            {props.breakDates
                                .sort((a, b) => a.defaultStartDate.valueOf() - b.defaultStartDate.valueOf())
                                .map((b) => (
                                    <TabsTrigger
                                        key={b.id}
                                        value={b.breakType}
                                        onClick={() => {
                                            setBreakOption(b.breakType);
                                            const newDate = { from: convertTimezone(b.defaultStartDate), to: convertTimezone(b.defaultEndDate) };
                                            console.log(newDate);
                                            setDate({ from: convertTimezone(b.defaultStartDate), to: convertTimezone(b.defaultEndDate) });
                                            setDepDate(convertTimezone(b.defaultStartDate));
                                            setArrDate(convertTimezone(b.defaultEndDate));
                                        }}
                                    >
                                        {breakTypeToName(b.breakType)}
                                    </TabsTrigger>
                                ))}
                        </TabsList>
                    </Tabs>
                    {scrollPosition.scrollLeft <= 200 && (
                        <FaCircleArrowRight
                            className="hidden sm:flex absolute h-fit w-fit right-0 top-0 bottom-0 mt-auto mb-auto mr-1 text-[#64748b] bg-[#f6f9fc] dark:bg-[#333333] dark:text-white rounded-full"
                            onClick={() => scroll(200)}
                        />
                    )}
                    {scrollPosition.scrollLeft >= 90 && (
                        <FaCircleArrowLeft
                            className="hidden sm:flex absolute h-fit w-fit left-0 top-0 bottom-0 mt-auto mb-auto ml-1 text-[#64748b] bg-[#f6f9fc] dark:bg-[#333333] dark:text-white rounded-full"
                            onClick={() => scroll(-200)}
                        />
                    )}
                </div>
                <div className="sm:relative flex gap-2 items-center">
                    <TypePicker type={tripType} setType={setTripType} possibleTypes={["Round trip", "One way"]} isAutopilot={false} />
                    <BagPicker
                        numCheckIn={numCheckIn}
                        setNumCheckIn={setNumCheckIn}
                        numCarryOn={numCarryOn}
                        setNumCarryOn={setNumCarryOn}
                    />
                </div>
            </div>
            <div className={cn("flex flex-col sm:flex-row gap-3 w-full relative", swapped && "flex-col-reverse sm:flex-row-reverse")}>
                <div className="w-full min-w-0">
                    <SchoolSelector
                        className={cn(
                            "py-2 px-3 gap-1 rounded bg-[#f6f9fc] dark:bg-[#333333] h-auto w-full focus:outline-none !m-0 border-0 text-base",
                            !config && "text-secondary"
                        )}
                        host={props.host}
                        placeholder={swapped ? "To?" : "From?"}
                    />
                </div>
                <SwapButton pressed={swapped} onClick={toggleDirection} />
                <AirportSelector
                    airportLocs={props.airportLocs}
                    dest={props.dest}
                    placeholder={swapped ? "From?" : "To?"}
                    setDest={props.setDest}
                    host={props.host}
                />
            </div>

            <div className="flex justify-center">
                {tripType === "One way" ? (
                    <>
                        <div className="hidden sm:flex">
                            <DatePicker
                                date={depDate}
                                setDate={setDepDate}
                            />
                        </div>
                        <div className="flex sm:hidden w-full">
                            <Popover>
                                <PopoverTrigger
                                    className="bg-[#333333] py-1.5 px-3 rounded-md w-full flex flex-row gap-2 items-center">
                                    <FaCalendarAlt className="text-primary" />
                                    {`${depDate?.toLocaleString("en-US", {
                                        month: 'short',
                                        day: 'numeric'
                                    })}`}
                                </PopoverTrigger>
                                <PopoverContent className="w-full">
                                    <DatePicker
                                        date={depDate}
                                        setDate={setDepDate}
                                        numberOfMonths={1}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </>
                ) : (
                    <>
                        <DateRangePicker
                            date={date}
                            setDate={setDate}
                            className="hidden sm:flex"
                        />
                        <div className="flex sm:hidden w-full">
                            <Popover>
                                <PopoverTrigger className="bg-[#f6f9fc] dark:bg-[#333333] py-1.5 px-3 rounded-md w-full flex flex-row gap-2 items-center">
                                    <FaCalendarAlt className="text-primary" />
                                    {`${date?.from?.toLocaleString("en-US", {
                                        month: 'short',
                                        day: 'numeric'
                                    })} - ${date?.to?.toLocaleString("en-US", {
                                        month: 'short',
                                        day: 'numeric'
                                    }) ?? ""}`}
                                </PopoverTrigger>
                                <PopoverContent className="w-full">
                                    <DateRangePicker
                                        date={date}
                                        setDate={setDate}
                                        numberOfMonths={1}
                                        showOutsideDays
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:mr-12 w-full mt-auto">
                {/* <div className="hidden sm:flex"></div> */}
                <button
                    className="ml-auto px-3 py-2 rounded bg-theme text-white flex flex-row gap-4 items-center justify-center disabled:opacity-50 transition duration-200 sm:w-fit w-full"
                    disabled={!config || !props.dest.size || !depDate || (tripType === "Round trip" && !date?.to)}
                    onClick={search}
                >
                    Search
                    <FaCircleArrowRight />
                </button>
            </div>
        </div>
    );
}

function getNextDate(dates: Break[]): BreakType | "custom" {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDates = dates.filter((date) => date.defaultStartDate > today);
    if (futureDates.length === 0) return "custom";

    let nextDate = futureDates[0];
    for (let date of futureDates) {
        if (date.defaultStartDate < nextDate.defaultStartDate) {
            nextDate = date;
        }
    }
    return nextDate.breakType;
}

function breakTypeToName(t: BreakType) {
    switch (t) {
        case "Fall":
            return "Fall Break";
        case "Winter":
            return "Winter Break";
        case "Spring":
            return "Spring Break";
        default:
            return t;
    }
}
