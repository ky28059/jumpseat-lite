import {
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
    useMemo,
    SetStateAction,
    Dispatch,
    Fragment,
} from 'react';

// Components
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';

// Icons
import { FaPlane } from 'react-icons/fa';
import { BiSubdirectoryRight } from 'react-icons/bi';
import { RxCross2 } from "react-icons/rx";

// Utils
import type { Airport } from '@/lib/airports';
import { cn } from '@/lib/utils';
import { FaLocationDot } from 'react-icons/fa6';
import { hostToConfig } from '@/lib/schools';


type AirportSelectorProps = {
    airportLocs: [string, Airport[]][]
    dest: Set<string>,
    setDest: (newDest: Set<string>) => void,
    placeholder: string,

    maxAirports?: number,
    maxSelected?: number,

    className?: string,
    popoverClassname?: string,
    host: string | null,
    onLanding?: boolean
}
export default function AirportSelector(props: AirportSelectorProps) {
    const excludedAirports = hostToConfig(props.host)?.excludedAirports ?? [];

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    const addDest = (...d: string[]) => {
        d.forEach((e) => props.dest.add(e));
        props.setDest(new Set(props.dest));
    };

    const removeDest = (...d: string[]) => {
        d.forEach((e) => props.dest.delete(e));
        props.setDest(new Set(props.dest));
    };

    // Autoscroll input to right on dest change
    useLayoutEffect(() => {
        inputWrapperRef.current?.scrollTo({ left: inputWrapperRef.current?.scrollWidth });
    }, [props.dest]);

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sort airports by size. For a location, consider the total amount of passengers travelling there (the sum
    // of enplanements at all the places airports).
    const sorted = useMemo(() => {
        return props.airportLocs.toSorted(([, a], [, b]) =>
            b.reduce((i, ap) => ap.size + i, 0) - a.reduce((i, ap) => ap.size + i, 0))
    }, [])

    const maxAirports = props.maxAirports ?? 15;
    const maxSelected = props.maxSelected ?? 3;

    const filtered = useMemo(() => {
        const ret: [string, Airport[]][] = [];
        let count = 0;

        for (const [loc, airports] of sorted) {
            if (count >= maxAirports) break;

            // If the query matches the location name, return all airports at that location.
            if (loc.toLowerCase().includes(query.toLowerCase())) {
                ret.push([loc, airports]);
                count += airports.length;

                if (airports.length > 1) count++; // Extra entry for location if mult. airports exist
                continue;
            }

            // Otherwise, look for airports that match the query instead.
            const filteredAirports = airports.filter((airport) =>
                airport.name.toLowerCase().includes(query.toLowerCase())
                || airport.iata.toLowerCase().includes(query.toLowerCase()));

            if (!filteredAirports.length) continue;

            ret.push([loc, filteredAirports]);
            count += filteredAirports.length;
        }

        return ret;
    }, [query, maxAirports]);

    return (
        <div ref={wrapperRef} className="relative w-full min-w-0">
            <div
                ref={inputWrapperRef}
                className={cn(
                    "flex py-2 px-3 gap-1 rounded bg-[#f6f9fc] dark:bg-[#333333] w-full focus:outline-none overflow-x-auto scrollbar:hidden",
                    props.className
                )}
            >
                {[...props.dest.values()].map((loc) => (
                    <div
                        className="flex gap-1 items-center px-2 py-[2px] bg-theme/30 text-theme font-semibold rounded-md text-sm"
                        key={loc}
                    >
                        <p>{loc}</p>
                        <RxCross2
                            className="cursor-pointer"
                            onClick={() => removeDest(loc)}
                        />
                    </div>
                ))}
                <input
                    type="text"
                    className="focus:outline-none bg-transparent w-36 flex-grow placeholder:text-secondary"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={props.placeholder}
                    value={query}
                    onFocus={() => setOpen(true)}
                    // disabled={dest.size >= 3}
                />
            </div>

            {open && (
                <div
                    className={cn(
                        `absolute rounded appearance-none w-full text-base top-10 bg-background left-0 z-50 max-w-lg min-w-[350px] mt-1 py-2 shadow-lg border${props.onLanding ? " max-h-40 overflow-y-scroll" : ""}`,
                        props.popoverClassname
                    )}
                >
                    {filtered.length === 0 ? (
                        <p className="text-secondary text-sm text-center py-4">
                            No airports found.
                        </p>
                    ) : filtered.map(([loc, airports]) => (
                        <Fragment key={loc}>
                            {airports.length > 1 && (
                                <div className={`flex justify-between items-center px-3 mx-2 rounded hover:bg-content-secondary dark:hover:bg-content transition duration-200${!airports.some((airport) => !excludedAirports.includes(airport.iata)) ? " opacity-30 hover:cursor-not-allowed" : ""}`}>
                                    <Label
                                        className={`flex-grow cursor-pointer m-0 text-primary flex items-center gap-2 py-2${!airports.some((airport) => !excludedAirports.includes(airport.iata)) ? " hover:cursor-not-allowed" : ""}`}
                                        htmlFor={loc}
                                    >
                                        <FaLocationDot size={14} className="text-theme" />
                                        <div>{loc}</div>
                                    </Label>
                                    <Checkbox
                                        id={loc}
                                        checked={airports.filter((airport) =>  !excludedAirports.includes(airport.iata)).every((airport) => props.dest.has(airport.iata)) && airports.some((airport) => !excludedAirports.includes(airport.iata))}
                                        disabled={!airports.filter((airport) =>  !excludedAirports.includes(airport.iata)).every((airport) => props.dest.has(airport.iata)) && props.dest.size >= maxSelected || !airports.some((airport) => !excludedAirports.includes(airport.iata))}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                const remaining = maxSelected - props.dest.size;
                                                addDest(...airports.filter((airport) =>  !excludedAirports.includes(airport.iata)).map((airport) => airport.iata).slice(0, remaining));
                                            } else {
                                                removeDest(...airports.filter((airport) =>  !excludedAirports.includes(airport.iata)).map((airport) => airport.iata));
                                            }
                                        }}
                                    />
                                </div>
                            )}
                            {airports.map((airport) => (
                                <div
                                    key={`${loc}-${airport.name}`}
                                    className={`flex justify-between gap-3 items-center px-3 mx-2 rounded hover:bg-content-secondary dark:hover:bg-content transition duration-200${excludedAirports.includes(airport.iata) ? " opacity-30 hover:cursor-not-allowed" : ""}`}
                                >
                                    <Label
                                        className={`flex-grow cursor-pointer m-0 text-primary flex items-center gap-2 py-2${excludedAirports.includes(airport.iata) ? " hover:cursor-not-allowed" : ""}`}
                                        htmlFor={`${loc}-${airport.name}`}
                                    >
                                        {airports.length > 1 && (
                                            <BiSubdirectoryRight
                                                size={22}
                                                className="opacity-40 flex-none"
                                            />
                                        )}
                                        <FaPlane size={16} className="text-theme flex-none" />
                                        <div className="text-pretty">{airport.name}</div>
                                        <div className="opacity-40">{airport.iata}</div>
                                    </Label>
                                    <Checkbox
                                        id={`${loc}-${airport.name}`}
                                        checked={props.dest.has(airport.iata)}
                                        disabled={(!props.dest.has(airport.iata) && props.dest.size >= maxSelected) || excludedAirports.includes(airport.iata)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                addDest(airport.iata);
                                            } else {
                                                removeDest(airport.iata);
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}
