import Image from "next/image"
import {FaChevronDown} from "react-icons/fa";
import React, {useState} from "react";
import {GoDotFill} from "react-icons/go";
import {IoAirplane} from "react-icons/io5";
import {Timeline} from "@/app/results/Timeline";
import {RiCrosshair2Line} from "react-icons/ri";
import {TravelDisplay, WaitDisplay} from "@/app/results/ComboCard";
import {Area, AreaChart, Tooltip} from "recharts";

const priceData = [
    {
        days: 0,
        price: 123.00
    },
    {
        days: 1,
        price: 96.00
    },
    {
        days: 2,
        price: 96.00
    },
    {
        days: 3,
        price: 96.00
    },
    {
        days: 4,
        price: 96.00
    },
    {
        days: 5,
        price: 96.00
    },
    {
        days: 6,
        price: 96.00
    },
    {
        days: 7,
        price: 123.00
    },
    {
        days: 8,
        price: 123.00
    },
    {
        days: 9,
        price: 123.00
    },
    {
        days: 10,
        price: 123.00
    },
    {
        days: 11,
        price: 123.00
    },
    {
        days: 12,
        price: 123.00
    },
    {
        days: 13,
        price: 123.00
    },
    {
        days: 14,
        price: 155.00
    },
    {
        days: 15,
        price: 155.00
    },
    {
        days: 16,
        price: 149.00
    },
    {
        days: 17,
        price: 149.00
    },
    {
        days: 18,
        price: 149.00
    },
    {
        days: 19,
        price: 155.00
    },
    {
        days: 20,
        price: 149.00
    },
    {
        days: 21,
        price: 155.00
    },
    {
        days: 22,
        price: 155.00
    },
    {
        days: 23,
        price: 134.00
    },
    {
        days: 24,
        price: 134.00
    },
    {
        days: 25,
        price: 134.00
    },
    {
        days: 26,
        price: 134.00
    },
    {
        days: 27,
        price: 134.00
    },
    {
        days: 28,
        price: 134.00
    },
    {
        days: 29,
        price: 134.00
    },
    {
        days: 30,
        price: 134.00
    },
    {
        days: 31,
        price: 134.00
    },
    {
        days: 32,
        price: 138.00
    },
    {
        days: 33,
        price: 75.00
    },
    {
        days: 34,
        price: 75.00
    },
    {
        days: 35,
        price: 95.00
    },
    {
        days: 36,
        price: 95.00
    },
    {
        days: 37,
        price: 85.00
    },
    {
        days: 38,
        price: 85.00
    },
    {
        days: 39,
        price: 118.00
    },
    {
        days: 40,
        price: 118.00
    },
    {
        days: 41,
        price: 133.00
    },
    {
        days: 42,
        price: 133.00
    },
    {
        days: 43,
        price: 125.00
    },
    {
        days: 44,
        price: 125.00
    },
    {
        days: 45,
        price: 125.00
    },
    {
        days: 46,
        price: 125.00
    },
    {
        days: 47,
        price: 125.00
    },
    {
        days: 48,
        price: 125.00
    },
    {
        days: 49,
        price: 133.00
    },
    {
        days: 50,
        price: 133.00
    },
    {
        days: 51,
        price: 133.00
    },
    {
        days: 52,
        price: 133.00
    },
    {
        days: 53,
        price: 133.00
    },
    {
        days: 54,
        price: 133.00
    },
    {
        days: 55,
        price: 133.00
    },
    {
        days: 56,
        price: 133.00
    },
    {
        days: 57,
        price: 133.00
    },
    {
        days: 58,
        price: 133.00
    },
    {
        days: 59,
        price: 208.00
    },
    {
        days: 60,
        price: 245.00
    },
]

type ShuttleOption = {
    departureTime: string,
    arrivalTime: string,
    provider: string,
    price: number
}

type SniperCardProps = {
    flightTime: string,
    shuttleTime: string,
    totalTripTime: string,
    airportWaitTime: string,
    price: number,
    airline: string,
    shuttleProvider: string,
    stops: string[],
    airports: string[], // idea is to have array of airports in order they will be visited
    departureDay: string,
    arrivalDay: string,
    shuttleOptions: ShuttleOption[],
}

export default function SniperCard() {
    const [expanded, setExpanded] = useState<boolean>(false)
    return (
        <div className={`group relative px-6 py-6 rounded-md shadow-lg bg-content w-[725px] border border-tertiary ${expanded ? "h-[540px]" : "h-[165px]"} flex flex-col items-center transition-[height] duration-300 overflow-y-clip`}>
            <div className="flex flex-row items-center justify-between w-full h-[90%] max-h-[103px]">
                <div className="flex flex-row items-center justify-between w-full h-full">
                    <div className="flex flex-col min-w-[200px] gap-3">
                        <div className="flex flex-row items-center gap-2 w-full h-full">
                            <div className="flex items-center justify-center rounded-md overflow-clip border-2 w-[44px] h-[44px] self-start">
                                <img
                                    key={"UA"}
                                    loading="lazy"
                                    src="https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/UA.svg"
                                    className="max-w-[45px] max-h-[45px]"
                                    alt="airline logo"
                                />
                            </div>
                            <div className="flex flex-col justify-between h-full justify-self-start">
                                <div>
                                    <p className="font-medium">7:30 AM - 2:20 PM</p>
                                    <div className="flex flex-row items-center gap-1">
                                        <div className="flex items-center rounded-full bg-blue-500 p-[3px]">
                                            <IoAirplane size={12} className="-rotate-90 text-white"/>
                                        </div>
                                        <p className="text-secondary text-xs">United, Korean Air</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <Timeline origin={"LAX"} destination={"ORD"}
                                  layover={"DFW"}
                                  layoverDuration={"1 hr"}
                                  time={"2h 10m"}
                                  type={"flight"}
                                  direction=/> */}
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <p className="text-sm font-medium">1 hr 10 min</p>
                            <p className="text-secondary text-[9px]">Airport Wait Time</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">1 stop</p>
                            <p className="text-secondary text-[9px]">45 min DFW</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <p className="text-sm font-medium text-lime-500">$333</p>
                            <p className="text-secondary text-[9px]">Saved with Sniper</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">1 stop</p>
                            <p className="text-secondary text-[9px]">45 min DFW</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div
                            className="bg-gray-400 p-[2px] rounded-md min-w-[95px] h-[110px]">
                            <div
                                className="flex flex-col justify-between h-full rounded-sm w-full p-2 bg-content">
                                <div className="text-end">
                                    <p className="text-lg font-semibold">$1,333</p>
                                    <p className="text-secondary text-[9px]">Economy</p>
                                    <p className="text-secondary text-[9px]">United.com</p>
                                </div>
                                <div
                                    className="bg-gray-400 text-center w-full self-center rounded-md text-white text-[10px] py-1 font-medium cursor-pointer hover:opacity-80">
                                    Select
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-gradient-to-r from-blue-800 to-blue-500 p-[2px] rounded-md min-w-[95px] h-[110px]">
                            <div
                                className="flex flex-col justify-between h-full rounded-sm w-full p-2 bg-content relative">
                                <div
                                    className="flex p-[2px] rounded-full bg-gradient-to-r from-blue-800 to-blue-500 absolute top-1 left-1">
                                    <RiCrosshair2Line size={9} className="text-white h-fit w-fit"/>
                                </div>
                                <div className="flex flex-col text-end items-end">
                                    <p className="text-lg font-semibold bg-gradient-to-r from-blue-800 to-blue-500 inline-block text-transparent bg-clip-text">$1,000</p>
                                    <p className="text-secondary text-[9px]">Economy</p>
                                    <p className="text-secondary text-[9px]">United.com</p>
                                </div>
                                <div
                                    className="bg-gradient-to-r from-blue-800 to-blue-500 text-center w-full self-center rounded-md text-white text-[10px] py-1 font-medium cursor-pointer hover:opacity-80">
                                    Select
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {expanded && <hr className="w-full border-tertiary mt-8 rounded-full mb-5"/>}
            {expanded && <div className="flex flex-row justify-between w-full mb-1">
                <p className="font-semibold">Travel time: 4 hrs 20 mins</p>
                <div className="flex flex-row gap-1 items-center font-medium">
                    <p>Depart</p>
                    <GoDotFill size={11}/>
                    <p>Tue, Aug 6</p>
                </div>
            </div>}
            {expanded &&
                <div className="flex flex-col w-full mt-3 gap-3 text-sm">
                    <TravelDisplay
                        destination={"John F. Kennedy Intl Airport (JFK)"}
                        origin={"Chicago O’Hare Intl (ORD)"}
                        time={"7:40 AM - 11:30 AM"}
                    />
                    <WaitDisplay
                        location={"New York (JFK)"}
                        time={"30 m"}
                    />
                    <TravelDisplay
                        destination={"Tokyo-Narita Intl Airport (NRT)"}
                        origin={"John F. Kennedy Intl Airport (JFK)"}
                        time={"12:00 PM - 2:20 PM"}
                    />
                    <WaitDisplay
                        location={"Tokyo-Narita Intl Airport (NRT)"}
                        time={"10 m"}
                    />
                    <TravelDisplay
                        destination={"Purdue University"}
                        origin={"Tokyo-Narita Intl Airport (NRT)"}
                        time={"2:30 PM - 5:10 PM"}
                        type={"shuttle"}
                    />
                </div>
            }
            {expanded &&
                <div className="mt-7">
                    <h1 className="font-semibold">Flight price over time</h1>
                    <div className="border-2 rounded-md overflow-clip mt-1">
                        <AreaChart
                            width={670}
                            height={90}
                            data={priceData}
                            margin={{
                                right: 0,
                                left: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#ef4444"/>
                                    <stop offset="40%" stopColor="#eab308"/>
                                    <stop offset="80%" stopColor="#84cc16"/>
                                </linearGradient>
                            </defs>
                            <Tooltip
                                wrapperClassName="rounded !px-3 !py-1 dark:!bg-background !border-tertiary"
                                labelClassName="text-xs text-secondary dark:text-primary"
                                labelFormatter={(label) => `${60 - label} day${60 - label !== 1 ? 's' : ''} ago`}
                                formatter={(price: number) => [`$${price}`]}
                            />
                            <Area
                                dataKey="price"
                                stroke="url(#colorUv)"
                                strokeWidth="2"
                                fill="url(#colorUv)"
                                fillOpacity={0.3}
                                dot={{r: 0}}
                                activeDot={{fill: '#000'}}
                            />
                        </AreaChart>
                    </div>
                </div>
            }
            <div
                className="opacity-0 group-hover:opacity-100 flex absolute bottom-0 rounded-t-md  items-center justify-center bg-gray-400 text-white w-[100px] py-[2px] hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => setExpanded(!expanded)}>
                <FaChevronDown size={12} className={`${expanded ? "rotate-180" : ""}`}/>
            </div>
        </div>
    )
}

