"use client";

import { Dispatch, SetStateAction, useEffect, useState, useContext } from "react";

// Components
import { ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/time-picker/time-picker";
import { Switch } from "@/components/ui/switch";
import TypePicker from "@/components/TypePicker";
import LoadingBubble from "@/components/LoadingBubble";
import confetti from "canvas-confetti";
import HackerFareModal from "./HackerFareModal";

// Icons
import { FaMedal, FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft, FaRegArrowAltCircleUp } from "react-icons/fa";
import { PiBread } from "react-icons/pi";
import { TimeValue } from "react-aria";
import { FaMagnifyingGlass, FaRegStar } from "react-icons/fa6";
import { LuPlane } from "react-icons/lu";

// Utils
import { updateUserBreak, markAsBooked } from "@/lib/db/userBreak";

// Types
import type { Break, UserBreak, Route, Flight } from "@prisma/client";

// Contexts
import { AutopilotContext } from "@/contexts/AutopilotContext";


type UserBreakWithBreak = UserBreak & { break: Break };
type RouteWithFlights = Route & { flights: Flight[] }

interface BreakCardProps {
    inputUserBreak: UserBreakWithBreak;
    inputRoutes: RouteWithFlights[];
    isTest: boolean;
}

type PriceGraphEntry = {
    date: number;
    price: number;
}

type RouteOption = {
    origin: string;
    destination: string;
    retOrigin?: string;
    retDestination?: string;
    depDate: Date;
    retDate?: Date;
    prices: number[];
    isHacker: boolean;
    bestRetPrice?: number;
}

const msOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
const msTo1159 = (24 * 60 - 1) * 60 * 1000;

const compareRoutes = (a: RouteOption, b: RouteOption): number => {
    const aLastPrice = a.prices[a.prices.length - 1];
    const bLastPrice = b.prices[b.prices.length - 1];

    if (aLastPrice < bLastPrice) return -1;
    if (aLastPrice > bLastPrice) return 1;
    return 0;
};

export default function BreakCard({ inputUserBreak, inputRoutes, isTest }: BreakCardProps) {

    const { excludedAirlines, excludedSchoolAirports } = useContext(AutopilotContext);

    const [expanded, setExpanded] = useState(false);
    const [tripType, setTripType] = useState("Round trip");
    const [userBreak, setUserBreak] = useState<UserBreakWithBreak>(inputUserBreak);
    const [depRoutes, setDepRoutes] = useState<RouteOption[] | null>(null);
    const [retRoutes, setRetRoutes] = useState<RouteOption[] | null>(null);
    const [roundRoutes, setRoundRoutes] = useState<RouteOption[] | null>(null);
    const [priceGraphData, setPriceGraphData] = useState<PriceGraphEntry[] | null>(null);
    const [axisRange, setAxisRange] = useState<number[]>([]);
    const [topOptions, setTopOptions] = useState<RouteOption[] | null>(null);
    const depRange = [
        (new Date(userBreak.break.defaultStartDate.getTime() - userBreak.break.leftStartRange * 24 * 60 * 60 * 1000)).getTime(),
        (new Date(userBreak.break.defaultStartDate.getTime() + userBreak.break.rightStartRange * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000)).getTime() - 1
    ];
    const retRange = [
        (new Date(userBreak.break.defaultEndDate.getTime() - userBreak.break.leftEndRange * 24 * 60 * 60 * 1000)).getTime(),
        (new Date(userBreak.break.defaultEndDate.getTime() + userBreak.break.rightEndRange * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000)).getTime() - 1
    ]

    const [hackerFareLinks, setHackerFareLinks] = useState<string[]>(["/results", "/results"]);
    const [hackerFareModalIsOpen, setHackerFareModalIsOpen] = useState<boolean>(false);

    function updateInterface(routeOptions: RouteOption[]) {
        if (userBreak.break.breakType == "Winter") {
            console.log(routeOptions);
        }
        let newPriceGraphData: PriceGraphEntry[] = [];
        if (routeOptions.length == 0) {
            return;
        }
        const seriesLength = routeOptions[0].prices.length;
        let lwr = 100000, upr = 0;
        for (let index = 0; index < seriesLength; index++) {
            let bestPrice = 10000000;
            for (let routeOption of routeOptions) {
                if (index < routeOption.prices.length && !isNaN(routeOption.prices[index])) {
                    bestPrice = Math.min(bestPrice, routeOption.prices[index]);
                }
            }
            lwr = Math.min(bestPrice, lwr);
            upr = Math.max(bestPrice, upr);
            newPriceGraphData.push({ date: seriesLength - index - 1, price: bestPrice });
        }
        if (userBreak.break.breakType == "Winter") {
            console.log(newPriceGraphData);
        }
        setAxisRange([lwr - 15, upr + 15]);
        setPriceGraphData(newPriceGraphData);
        setTopOptions(routeOptions.filter((r) => r.prices[r.prices.length - 1] < 10000000));
    }

    useEffect(() => {
        if (!roundRoutes || !depRoutes || !retRoutes) {
            return;
        }
        if (tripType == "Round trip")
            updateInterface(roundRoutes);
        else if (tripType == "Departure")
            updateInterface(depRoutes);
        else
            updateInterface(retRoutes);
    }, [tripType]);

    useEffect(() => {

        const msInDay = 24 * 60 * 60 * 1000;
        const getSideOfDay = (d: Date, getStart: boolean = true) => new Date(d.getTime() - (d.getHours() * 60 + d.getMinutes()) * 60 * 1000 + (getStart ? 0 : msInDay));

        const populateRoutes = async () => {
            let newValidRoutes: RouteWithFlights[] = [];
            for (let inputRoute of inputRoutes) {
                const schoolAirport = inputRoute.direction == "toSchool" ? inputRoute.destination : inputRoute.origin;
                const depDate = inputRoute.depDate;
                const isBadRoute = (
                    excludedSchoolAirports.includes(schoolAirport) ||
                    inputRoute.direction == "fromSchool" && (depDate < getSideOfDay(userBreak.depStartTime) || depDate > getSideOfDay(userBreak.depEndTime, false)) ||
                    inputRoute.direction == "toSchool" && (depDate < getSideOfDay(userBreak.retStartTime) || depDate > getSideOfDay(userBreak.retEndTime, false))
                );
                if (isBadRoute) continue;
                let newValidFlights: Flight[] = [];
                for (let flight of inputRoute.flights) {
                    const flightDepTime = flight.depTime;
                    const flightArrTime = flight.arrTime;
                    const isBadFlight = (
                        userBreak.needsCarryOn && !flight.hasCarryOn ||
                        userBreak.noLayovers && flight.layoverAirport != "" ||
                        excludedAirlines.includes(flight.airline) ||
                        inputRoute.direction == "fromSchool" && (flightDepTime < userBreak.depStartTime || flightDepTime > userBreak.depEndTime) ||
                        inputRoute.direction == "toSchool" && (flightArrTime < userBreak.retStartTime || flightArrTime > userBreak.retEndTime)
                    );
                    if (!isBadFlight) newValidFlights.push(flight);
                }
                newValidRoutes.push({...inputRoute, flights: newValidFlights});
            }
            let newDepRoutes = [];
            let newRetRoutes = [];
            for (let route of newValidRoutes) {
                let option: RouteOption = {
                    origin: route.origin,
                    destination: route.destination,
                    depDate: route.depDate,
                    prices: [],
                    isHacker: false
                }
                const pointCount = route.timings.length;
                for (let i = 0; i < pointCount; i++) {
                    let bestPrice = 10000000;
                    for (let flight of route.flights) {
                        const timingIndex = flight.timingIndex;
                        if (timingIndex > i) {
                            continue;
                        }
                        const price = flight.prices[i - timingIndex];
                        if (price != -1 && bestPrice > price) {
                            bestPrice = price;
                        }
                    }
                    option.isHacker = false;
                    option.prices.push(bestPrice);
                }
                if (route.direction == "fromSchool") {
                    newDepRoutes.push(option);
                } else {
                    newRetRoutes.push(option);
                }
            }
            let newRoundRoutes: RouteOption[] = [];
            for (let depRoute of newDepRoutes) {
                for (let retRoute of newRetRoutes) {
                    let newOption: RouteOption = {
                        origin: depRoute.origin,
                        destination: depRoute.destination,
                        retOrigin: retRoute.origin,
                        retDestination: retRoute.destination,
                        depDate: depRoute.depDate,
                        retDate: retRoute.depDate,
                        prices: [],
                        isHacker: false
                    }
                    for (let i = 0; i < depRoute.prices.length; i++) {
                        newOption.prices.push(depRoute.prices[i] + retRoute.prices[i]);
                    }
                    if (newOption.destination != newOption.retOrigin || newOption.origin != newOption.retDestination) {
                        newOption.isHacker = true;
                        newOption.bestRetPrice = retRoute.prices[retRoute.prices.length - 1];
                    }
                    newRoundRoutes.push(newOption);
                }
            }
            newDepRoutes.sort(compareRoutes);
            setDepRoutes(newDepRoutes);
            newRetRoutes.sort(compareRoutes);
            setRetRoutes(newRetRoutes);
            newRoundRoutes.sort(compareRoutes);
            setRoundRoutes(newRoundRoutes);
            if (tripType == "Round trip")
                updateInterface(newRoundRoutes);
            else if (tripType == "Departure")
                updateInterface(newDepRoutes);
            else
                updateInterface(newRetRoutes);
        }
        
        populateRoutes();
    }, [userBreak, excludedAirlines, excludedSchoolAirports]);

    const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function launchConfetti() {
        confetti({
            particleCount: 150,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 150,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
    }

    return (
        <div className={`flex flex-col shadow-lg rounded-lg border text-primary dark:bg-black p-4 md:p-8 gap-3 w-[96%] md:w-[900px] transition duration-500 ${isTest ? "pointer-events-none select-none" : ""} ${userBreak.hasBooked ? "opacity-60" : ""}`}>
            <div className="flex flex-row items-center justify-between gap-2">
                <div
                    className="flex flex-col md:flex-row min-w-[48%] md:min-w-[360px] gap-2 items-start md:items-center">
                    <h3 className="text-xl md:text-2xl text-primary font-semibold">{userBreak.break.breakType} Break {userBreak.break.realStartDate.getFullYear()}</h3>
                    <p className="text-sm md:text-base">{`${monthList[userBreak.break.realStartDate.getMonth()]} ${userBreak.break.realStartDate.getDate()}`} - {`${monthList[userBreak.break.realEndDate.getMonth()]} ${userBreak.break.realEndDate.getDate()}`}</p>
                </div>
                <div className="w-fit flex flex-col-reverse md:flex-row gap-2 md:gap-0">
                    <TypePicker type={tripType} setType={setTripType} possibleTypes={["Round trip", "Departure", "Return"]} isAutopilot={true} />
                    <button
                        className={`px-2 py-1.5 md:px-3 md:py-1.5 rounded-sm text-sm text-white md:ml-2 hover:opacity-75 transition ${userBreak.hasBooked ? "bg-green-400" : "bg-red-400"}`}
                        onClick={() => {
                            const newStatus = !userBreak.hasBooked;
                            markAsBooked(userBreak.id, newStatus);
                            setUserBreak({...userBreak, hasBooked: newStatus});
                            if (newStatus == true) {
                                launchConfetti();
                            }
                        }}>
                        {userBreak.hasBooked ? "Booked!" : "Mark as booked"}
                    </button>
                </div>
            </div>
            {userBreak == null ? (
                <LoadingBubble className=""/>
            ) : (
                <div className="flex flex-col md:flex-row items-center h-full gap-2 md:gap-4 w-full">
                    <Preferences expanded={expanded} setExpanded={setExpanded}
                                 userBreak={userBreak} setUserBreak={setUserBreak}
                                 depRange={depRange} retRange={retRange} />
                    <div className="flex flex-col gap-2 sm:gap-4 w-full">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                            {!topOptions ? "loading" : <TopOptions topOptions={topOptions} tripType={tripType} userBreak={userBreak} setHackerFareLinks={setHackerFareLinks} setHackerFareModalIsOpen={setHackerFareModalIsOpen} />}
                            {!expanded && (
                                <Advice
                                    className={expanded ? "w-0" : "w-full"}
                                    adviceString={userBreak.advice}
                                />
                            )}
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                            <PriceHistory data={priceGraphData} axisRange={axisRange} />
                            {expanded && <Advice adviceString={userBreak.advice} />}
                        </div>
                    </div>
                </div>
            )}
            <HackerFareModal setIsOpen={setHackerFareModalIsOpen} isOpen={hackerFareModalIsOpen} hackerFareLinks={hackerFareLinks}/>
        </div>
    );
}

type PreferencesProps = {
    expanded: boolean;
    setExpanded: Dispatch<SetStateAction<boolean>>;
    userBreak: UserBreak & { break: Break };
    setUserBreak: Dispatch<SetStateAction<UserBreak & { break: Break }>>;
    depRange: number[];
    retRange: number[];
};

const Preferences = ({ expanded, setExpanded, userBreak, setUserBreak, depRange, retRange }: PreferencesProps) => {

    function formatDate(date: Date): string {
        const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
        const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "numeric", day: "numeric" });
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });

        const dayOfWeek: string = dayFormatter.format(date); // e.g., "Monday"
        const monthDay: string = dateFormatter.format(date); // e.g., "9/30"
        const time: string = timeFormatter.format(date); // e.g., "10:00 PM"

        return `${dayOfWeek} ${monthDay}, ${time.toLowerCase()}`; // Lowercase the AM/PM
    }

    function dateToTimeValue(date: Date | undefined): TimeValue {
        if (date) {
            // @ts-ignore
            return {
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
            };
        }
        // @ts-ignore
        return {
            hour: 0,
            minute: 0,
            second: 0,
        };
    }

    function updateField(key: keyof UserBreak, value: UserBreak[keyof UserBreak]) {
        setUserBreak({ ...userBreak, [key]: value });
        updateUserBreak(userBreak.id, {[key]: value});
    }

    return (
        <div
                className={`relative flex flex-col bg-[#f6f9fc] md:h-full w-full dark:bg-[#141414] rounded-md p-3 transition-[height] md:transition-[width] ${
                expanded ? "md:w-[310px] md:min-w-[310px] h-[350px]" : "md:w-[50px] h-[50px]"
            }`}
        >
            {!expanded && (
                <div className="flex flex-row md:flex-col gap-2 items-center cursor-pointer md:mt-1"
                     onClick={() => setExpanded(true)}>
                    <FaRegArrowAltCircleRight
                        size={20}
                        className="text-blue-500 animate-pulse-blue duration-1000 md:flex hidden"
                    />
                    <FaRegArrowAltCircleRight
                        size={18}
                        className="text-blue-500 animate-pulse-blue duration-1000 md:hidden flex"
                    />
                    <h3 className="text-lg md:text-xl text-primary font-medium md:[writing-mode:vertical-lr] animate-pulse-blue duration-1000">
                        Open preferences
                    </h3>
                </div>
            )}
            {expanded && (
                <div className="overflow-hidden h-full flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-2 items-center">
                            <LuPlane size={18} className="text-blue-500 md:hidden flex" />
                            <LuPlane size={22} className="text-blue-500 md:flex hidden" />
                            <h3 className="text-lg md:text-xl text-primary font-medium">Preferences</h3>
                        </div>
                        <FaRegArrowAltCircleLeft
                            size={20}
                            className="text-gray-400 cursor-pointer md:flex hidden"
                            onClick={() => setExpanded(false)}
                        />
                        <FaRegArrowAltCircleUp
                            size={18}
                            className="text-gray-400 cursor-pointer md:hidden flex"
                            onClick={() => setExpanded(false)}
                        />
                    </div>
                    <div className="flex flex-col h-full">
                        <div className="border-b">
                            <div className="w-full p-2 text-primary border-b">
                                <p>Departure range</p>
                                <div className="flex flex-row w-full mt-2">
                                    <div><CustomArrowIcon /></div>
                                    <div className="w-full">
                                        <div className="w-full flex flex-row justify-between">
                                            <p>{userBreak.depStartTime ? formatDate(userBreak.depStartTime) : "Choose date"}</p>
                                            <PreferencesEditPopover
                                                date={userBreak.depStartTime}
                                                setDate={(newDate: Date | undefined) => {
                                                    if (newDate) {
                                                        const newMS = newDate.getTime();
                                                        if (newMS < depRange[0] || newMS > depRange[1]) return;
                                                        if (newMS > userBreak.depEndTime.getTime()) return;
                                                        setUserBreak({ ...userBreak, depStartTime: newDate });
                                                        updateUserBreak(userBreak.id, { depStartTime: new Date(newMS - msOffset)});
                                                    }
                                                        
                                                }}
                                                time={dateToTimeValue(userBreak.depStartTime)}
                                                setTime={(newTime: TimeValue) => {
                                                    const newDate = new Date(userBreak.depStartTime);
                                                    newDate.setHours(newTime.hour, newTime.minute);
                                                    const newMS = newDate.getTime();
                                                    if (newMS < depRange[0] || newMS > depRange[1]) return;
                                                    if (newMS > userBreak.depEndTime.getTime()) return;
                                                    setUserBreak({ ...userBreak, depStartTime: newDate });
                                                    updateUserBreak(userBreak.id, { depStartTime: new Date(newMS - msOffset)});
                                                }}
                                                range={[new Date(depRange[0]), new Date(depRange[1])]}/>
                                        </div>
                                        <div className="w-full flex flex-row justify-between">
                                            <p>{userBreak.depEndTime ? formatDate(userBreak.depEndTime) : "Choose date"}</p>
                                            <PreferencesEditPopover
                                                date={userBreak.depEndTime}
                                                setDate={(newDate: Date | undefined) => {
                                                    if (newDate) {
                                                        const newMS = newDate.getTime() + msTo1159;
                                                        if (newMS < depRange[0] || newMS > depRange[1]) return;
                                                        if (newMS < userBreak.depStartTime.getTime()) return;
                                                        setUserBreak({ ...userBreak, depEndTime: new Date(newMS) });
                                                        updateUserBreak(userBreak.id, { depEndTime: new Date(newMS - msOffset)});
                                                    }
                                                }}
                                                time={dateToTimeValue(userBreak.depEndTime)}
                                                setTime={(newTime: TimeValue) => {
                                                    const newDate = new Date(userBreak.depEndTime);
                                                    newDate.setHours(newTime.hour, newTime.minute);
                                                    const newMS = newDate.getTime();
                                                    if (newMS < depRange[0] || newMS > depRange[1]) return;
                                                    if (newMS < userBreak.depStartTime.getTime()) return;
                                                    setUserBreak({ ...userBreak, depEndTime: newDate });
                                                    updateUserBreak(userBreak.id, { depEndTime: new Date(newMS - msOffset)});
                                                }}
                                                range={[new Date(depRange[0]), new Date(depRange[1])]}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full p-2 text-primary">
                                <p>Return range</p>
                                <div className="flex flex-row w-full mt-2">
                                    <CustomArrowIcon />
                                    <div className="w-full">
                                        <div className="w-full flex flex-row justify-between">
                                            <p>{userBreak.retStartTime ? formatDate(userBreak.retStartTime) : "Choose date"}</p>
                                            <PreferencesEditPopover
                                                date={userBreak.retStartTime}
                                                setDate={(newDate: Date | undefined) => {
                                                    if (newDate) {
                                                        const newMS = newDate.getTime();
                                                        if (newMS < retRange[0] || newMS > retRange[1]) return;
                                                        if (newMS > userBreak.retEndTime.getTime()) return;
                                                        setUserBreak({ ...userBreak, retStartTime: newDate });
                                                        updateUserBreak(userBreak.id, { retStartTime: new Date(newMS - msOffset)});
                                                    }
                                                }}
                                                time={dateToTimeValue(userBreak.retStartTime)}
                                                setTime={(newTime: TimeValue) => {
                                                    const newDate = new Date(userBreak.retStartTime);
                                                    newDate.setHours(newTime.hour, newTime.minute);
                                                    const newMS = newDate.getTime();
                                                    if (newMS < retRange[0] || newMS > retRange[1]) return;
                                                    if (newMS > userBreak.retEndTime.getTime()) return;
                                                    setUserBreak({ ...userBreak, retStartTime: newDate });
                                                    updateUserBreak(userBreak.id, { retStartTime: new Date(newMS - msOffset)});
                                                }}
                                                range={[new Date(retRange[0]), new Date(retRange[1])]}/>
                                        </div>
                                        <div className="w-full flex flex-row justify-between">
                                            <p>{userBreak.retEndTime ? formatDate(userBreak.retEndTime) : "Choose date"}</p>
                                            <PreferencesEditPopover
                                                date={userBreak.retEndTime}
                                                setDate={(newDate: Date | undefined) => {
                                                    if (newDate) {
                                                        const newMS = newDate.getTime() + msTo1159;
                                                        if (newMS < retRange[0] || newMS > retRange[1]) return;
                                                        if (newMS < userBreak.retStartTime.getTime()) return;
                                                        setUserBreak({ ...userBreak, retEndTime: new Date(newMS) });
                                                        updateUserBreak(userBreak.id, { retEndTime: new Date(newMS - msOffset)});
                                                    }
                                                }}
                                                time={dateToTimeValue(userBreak.retEndTime)}
                                                setTime={(newTime: TimeValue) => {
                                                    const newDate = new Date(userBreak.retEndTime);
                                                    newDate.setHours(newTime.hour, newTime.minute);
                                                    const newMS = newDate.getTime();
                                                    if (newMS < retRange[0] || newMS > retRange[1]) return;
                                                    if (newMS < userBreak.retStartTime.getTime()) return;
                                                    setUserBreak({ ...userBreak, retEndTime: newDate });
                                                    updateUserBreak(userBreak.id, { retEndTime: new Date(newMS - msOffset)});
                                                }}
                                                range={[new Date(retRange[0]), new Date(retRange[1])]}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="p-2 flex flex-row justify-between gap-4 text-primary border-b">
                                <p>Carry on</p>
                                <Switch
                                    checked={userBreak.needsCarryOn}
                                    onCheckedChange={(checked: boolean) => {
                                        updateField("needsCarryOn", checked);
                                    }}
                                />
                            </div>
                            <div className="p-2 flex flex-row justify-between gap-4 text-primary">
                                <p>Direct flights only</p>
                                <Switch
                                    checked={userBreak.noLayovers}
                                    onCheckedChange={(checked: boolean) => {
                                        updateField("noLayovers", checked);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

type PreferencesEditPopoverProps = {
    date: Date | undefined;
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>> | ((newDate: Date | undefined) => void);
    time: TimeValue | undefined;
    setTime: React.Dispatch<React.SetStateAction<TimeValue | undefined>> | ((newTime: TimeValue) => void);
    range: Date[]
};

const PreferencesEditPopover = ({date, setDate, time, setTime, range}: PreferencesEditPopoverProps) => {
    return (
        <Popover>
            <PopoverTrigger>
                <p className="underline cursor-pointer opacity-60">edit</p>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <Calendar defaultMonth={date} mode="single" selected={date} onSelect={setDate} fromDate={range[0]}
                          toDate={range[1]} initialFocus/>
                <div className="flex flex-row justify-between align-center h-full px-5 mb-3">
                    <p className="self-center h-fit text-sm">Set Time</p>
                    <div className="w-fit">
                        <TimePicker onChange={setTime} value={time} />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

type TopOptionsProps = {
    topOptions: RouteOption[];
    tripType: string;
    userBreak: UserBreak;
    setHackerFareLinks: Dispatch<SetStateAction<string[]>>;
    setHackerFareModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

const TopOptions = ({ topOptions, tripType, userBreak, setHackerFareLinks, setHackerFareModalIsOpen}: TopOptionsProps) => {


    const isSameDay = (a: Date, b: Date) => a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear();
    const getTotalMinutes = (a: Date) => a.getHours() * 60 + a.getMinutes();

    return (
            <div className="flex flex-col w-full bg-[#f6f9fc] dark:bg-[#141414] rounded-md p-3">
            <div className="flex flex-row gap-2 items-center">
                <FaRegStar size={22} className="text-blue-500 md:flex hidden" />
                <FaRegStar size={20} className="text-blue-500 md:hidden flex" />
                <h3 className="text-lg md:text-xl text-primary font-medium">Top options</h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="text-[10px] md:text-xs">
                        <TableHead></TableHead>
                        <TableHead>Origin</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Link(s)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topOptions.slice(0, 3).map((option, index) => (
                        <TableRow key={index} className="h-1 text-[11px] md:text-sm">
                            <TableCell>
                                {index === 0 && <FaMedal size={16} className="text-amber-300" />}
                                {index === 1 && <FaMedal size={16} className="text-slate-400" />}
                                {index === 2 && <FaMedal size={16} className="text-yellow-700" />}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{option.origin}</span>
                                    {option.retOrigin && <span>{option.retOrigin}</span>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{option.destination}</span>
                                    {option.retDestination && <span>{option.retDestination}</span>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{option.depDate.toDateString().slice(0, 10)}</span>
                                    {option.retDate && <span>{option.retDate.toDateString().slice(0, 10)}</span>}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div
                                    className="p-1 bg-blue-500 text-white rounded-sm cursor-pointer hover:opacity-75 transition text-center"
                                >
                                    {option.isHacker ? 
                                    <button className="w-full h-full" onClick={() => {
                                        setHackerFareModalIsOpen(true);
                                        setHackerFareLinks(
                                            [
                                                `/results?${new URLSearchParams(
                                                    {
                                                        roundTrip: "false",
                                                        direction: "fromSchool",
                                                        extAirports: option.destination,
                                                        depDate: option.depDate.toISOString().slice(0, 10),
                                                        retDate: "",
                                                        depRangeStart: isSameDay(option.depDate, userBreak.depStartTime) ? String(getTotalMinutes(userBreak.depStartTime)) : "",
                                                        depRangeEnd: isSameDay(option.depDate, userBreak.depEndTime) ? String(getTotalMinutes(userBreak.depEndTime)) : "",
                                                        carryCnt: "0",
                                                        checkCnt: "0"
                                                    }
                                                )}`,
                                                `/results?${new URLSearchParams(
                                                    {
                                                        roundTrip: "false",
                                                        direction: "toSchool",
                                                        extAirports: option.retOrigin!,
                                                        depDate: option.retDate!.toISOString().slice(0, 10),
                                                        retDate: "",
                                                        arrRangeStart: isSameDay(option.depDate, userBreak.retStartTime) ? String(getTotalMinutes(userBreak.retStartTime)) : "",
                                                        arrRangeEnd: isSameDay(option.depDate, userBreak.retEndTime) ? String(getTotalMinutes(userBreak.retEndTime)) : "",
                                                        carryCnt: "0",
                                                        checkCnt: "0"
                                                    }
                                                )}`
                                            ]);
                                    }} >${option.prices[option.prices.length - 1]}</button>
                                    : 
                                        <button onClick={() => window.open(`/results?${new URLSearchParams(
                                            {
                                                roundTrip: String(tripType == "Round trip" && !option.isHacker),
                                                direction: tripType != "Return" ? "fromSchool" : "toSchool",
                                                extAirports: tripType != "Return" ? option.destination : option.origin,
                                                depDate: option.depDate.toISOString().slice(0, 10),
                                                retDate: option.retDate ? option.retDate.toISOString().slice(0, 10) : "",
                                                depRangeStart: isSameDay(option.depDate, userBreak.depStartTime) ? String(getTotalMinutes(userBreak.depStartTime)) : "",
                                                depRangeEnd: isSameDay(option.depDate, userBreak.depEndTime) ? String(getTotalMinutes(userBreak.depEndTime)) : "",
                                                carryCnt: "0",
                                                checkCnt: "0"
                                            }
                                        )}`)}>
                                            ${option.prices[option.prices.length - 1]}
                                        </button>
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

type AdviceProps = {
    className?: string;
    adviceString: string;
};

const Advice = ({ className, adviceString }: AdviceProps) => {
    return (
        <div
                className={`flex flex-col md:max-w-[250px] bg-[#f6f9fc] dark:bg-[#141414] rounded-md p-3 text-primary gap-2 transition-[width] ${className}`}
        >
            <div className="flex flex-row gap-2 items-center">
                <FaMagnifyingGlass size={16} className="text-blue-500 md:hidden flex" />
                <FaMagnifyingGlass size={18} className="text-blue-500 md:flex hidden" />
                <h3 className="text-lg md:text-xl text-primary font-medium">Advice</h3>
            </div>
            <p className="text-sm md:text-base">{adviceString}</p>
        </div>
    );
};

type PriceHistoryProps = {
    data: PriceGraphEntry[] | null;
    axisRange: number[];
}

const PriceHistory = ({ data, axisRange }: PriceHistoryProps) => {
    return (
            <div className="flex flex-col bg-[#f6f9fc] dark:bg-[#141414] p-3 rounded-md w-full">
            <div className="flex flex-row gap-2 items-center">
                <PiBread size={24} className="text-blue-500 md:flex hidden" />
                <PiBread size={20} className="text-blue-500 md:hidden flex" />
                <h3 className="text-lg md:text-xl text-primary font-medium">Price history</h3>
            </div>
            <div className="mt-2 w-full h-full">
                <ResponsiveContainer width="100%" height={190}>
                    <AreaChart
                        height={190}
                        data={data!}
                        margin={{
                            top: 15,
                            right: 20,
                            left: 5,
                            bottom: 10,
                        }}
                    >

                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="40%" stopColor="#eab308" />
                                <stop offset="80%" stopColor="#84cc16" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-tertiary dark:stroke-secondary"
                            verticalCoordinatesGenerator={(props) => props.width > 450 ? [150, 300, 450, 600] : [100, 200, 250]}
                        />
                        <XAxis
                            dataKey="date"
                            label={{ value: "Days ago", position: "insideBottomRight", offset: 0 }}
                            tick={{ fill: "#666", fontSize: 12 }}
                            className="text-xs [&_text]:!fill-secondary dark:[&_text]:!fill-primary"
                            minTickGap={30}
                        />
                        <YAxis
                            label={{ value: "Price ($)", angle: -90, position: "insideLeft", offset: 15 }}
                            tick={{ fill: "#666", fontSize: 12 }}
                            className="text-sm [&_text]:!fill-secondary dark:[&_text]:!fill-primary"
                            domain={axisRange}
                        />
                        <Tooltip
                            wrapperClassName="rounded !px-3 !py-1 dark:!bg-background !border-tertiary"
                            labelClassName="text-xs text-secondary dark:text-primary"
                            labelFormatter={(label) => label == 0 ? "Today" : `${label} day${label !== 1 ? "s" : ""} ago`} // label is the date
                            formatter={(price: number) => [`$${price}`]}
                        />
                        <Area
                            dataKey="price"
                            stroke="url(#colorUv)"
                            strokeWidth="2"
                            fill="url(#colorUv)"
                            fillOpacity={0.3}
                            dot={{ r: 0 }}
                            activeDot={{ fill: "#000" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const CustomArrowIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12.5 25" // Half the original width
            fill="none"
            stroke="rgba(108,113,126,255)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="25px"
            height="60px"
        >
            <path d="M1.25 2.5 H7.5" />
            <path d="M1.25 2.5 V15" />
            <path d="M1.25 15 H10" />
            <path d="M7.5 12.5 L10 15 L7.5 17.5" />
        </svg>
    );
};
