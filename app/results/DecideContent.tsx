'use client'

import { useContext, useEffect, useState, useTransition } from 'react';

// Components
import ResultsSidebar from '@/app/results/ResultsSidebar';
import ResultsSortSelector from '@/app/results/ResultsSortSelector';
import ComboCard from '@/app/results/ComboCard';
import Spinner from '@/components/Spinner';

// Contexts
import ResultsContext, { ResultsStage, SortType } from '@/contexts/ResultsContext';

// Utils
import type { Combo } from '@/app/results/ComboCard';
import type { Itinerary } from '@/lib/search/serp';
import { getCombos } from '@/lib/search';
import { calculateComboTimes } from '@/lib/time';
import { cn } from '@/lib/utils';


type DecideContentProps = {
    from: string,
    to: string,

    depFlight?: Itinerary | null,
    selectedCombo: Combo | null,
    setSelectedCombo: (f: Combo) => void,
    setShuttleIndex: (i: number) => void,

    hidden: boolean,
    return?: boolean,
    depShuttleIndex?: number,
    schoolID: number
}

export default function DecideContent(props: DecideContentProps) {
    const [combos, setCombos] = useState<Combo[]>([]);
    const [parsed, setParsed] = useState<Combo[]>([]); // TODO: derived state?

    const [refreshing, startTransition] = useTransition();

    const { school, roundTrip, depDate, retDate, direction, extAirports, filter, airportMap, depCombo, carryCnt, checkCnt, stage } = useContext(ResultsContext);
    const [sort, setSort] = useState<SortType>(SortType.BEST);

    // Fetch all combos. For return flights, wait until a departure flight has been selected first.
    useEffect(() => {
        if (props.return && !props.depFlight) return;

        getCombos({
            school,
            roundTrip,
            direction,
            externalAirports: extAirports,
            departureDate: depDate,
            returnDate: retDate,
            carryOnCnt: carryCnt,
            checkInCnt: checkCnt,
            departureToken: props.depFlight?.departure_token
        }).then((c) => {
            setCombos(c.filter(d => d.shuttleOptions.length > 0));
            // TODO: if there are no options, display some error message
        });
        
    }, [props.depFlight]);

    /**
     * Compare two combos by their total travel time *only*.
     * @param a The first combo.
     * @param b The second combo.
     */
    function sortFastest(a: Combo, b: Combo) {
        const { totalMinutes: totalMinutesA } = calculateComboTimes(a.itinerary, a.shuttleOptions[0], airportMap);
        const { totalMinutes: totalMinutesB } = calculateComboTimes(b.itinerary, b.shuttleOptions[0], airportMap);

        return totalMinutesA - totalMinutesB;
    }

    /**
     * Compare two combos by their price primary, breaking ties by travel time.
     * @param a The first combo.
     * @param b The second combo.
     */
    function sortCheapest(a: Combo, b: Combo) {
        return (a.itinerary.price + a.shuttleOptions[0].price) - (b.itinerary.price + b.shuttleOptions[0].price)
            || sortFastest(a, b);
    }

    /**
     * Compare two combos by total travel time *and* price, assigning equal weight to each.
     * @param a The first combo.
     * @param b The second combo.
     * @param minMinutes The minimum travel time among all combos (for normalization).
     * @param maxMinutes The maximum travel time among all combos (for normalization).
     * @param minPrice The minimum price among all combos (for normalization).
     * @param maxPrice The maximum price among all combos (for normalization).
     */
    function sortBest(a: Combo, b: Combo, minMinutes: number, maxMinutes: number, minPrice: number, maxPrice: number) {
        const { totalMinutes: totalMinutesA } = calculateComboTimes(a.itinerary, a.shuttleOptions[0], airportMap);
        const normalizedMinutesA = (totalMinutesA - minMinutes) / (maxMinutes - minMinutes);

        const { totalMinutes: totalMinutesB } = calculateComboTimes(b.itinerary, b.shuttleOptions[0], airportMap);
        const normalizedMinutesB = (totalMinutesB - minMinutes) / (maxMinutes - minMinutes);

        const normalizedPriceA = (a.itinerary.price - minPrice) / (maxPrice - minPrice);
        const normalizedPriceB = (b.itinerary.price - minPrice) / (maxPrice - minPrice);

        return (normalizedPriceA + normalizedMinutesA) - (normalizedPriceB + normalizedMinutesB);
    }

    useEffect(() => {
        startTransition(async () => {
            if (combos.length == 0) return;

            const originCheckboxes = props.return ? filter.toAirports : filter.fromAirports;
            const destCheckboxes = props.return ? filter.fromAirports : filter.toAirports;

            const filtered = combos
                .filter((c) => originCheckboxes[c.itinerary.flights[0].departure_airport.id].value)
                .filter((c) => destCheckboxes[c.itinerary.flights.at(-1)!.arrival_airport.id].value)
                .filter((c) => (filter.stops['stops-none'].value && !c.itinerary.layovers?.length)
                    || (filter.stops['stops-one'].value && c.itinerary.layovers?.length === 1)
                    || (filter.stops['stops-mult'].value && c.itinerary.layovers?.length && c.itinerary.layovers.length > 1))
                .map((c) => ({ ...c, shuttleOptions: c.shuttleOptions.filter(s => filter.shuttles[s.providerID.toString()].value) }))
                .filter((c) => c.shuttleOptions.length > 0);

            // Normalize prices for "best" sort
            const minPrice = filtered.reduce((m, c) => Math.min(m, c.itinerary.price), Number.MAX_SAFE_INTEGER);
            const maxPrice = filtered.reduce((m, c) => Math.max(m, c.itinerary.price), 0);

            const minTimeMinutes = filtered.reduce((m, c) => {
                const { totalMinutes } = calculateComboTimes(c.itinerary, c.shuttleOptions[0], airportMap);
                return Math.min(m, totalMinutes);
            }, Number.MAX_SAFE_INTEGER);
            const maxTimeMinutes = filtered.reduce((m, c) => {
                const { totalMinutes } = calculateComboTimes(c.itinerary, c.shuttleOptions[0], airportMap);
                return Math.max(m, totalMinutes);
            }, 0);

            let newParsed  = filtered.sort(
                sort === SortType.FASTEST ? sortFastest :
                sort === SortType.CHEAPEST ? sortCheapest :
                (a, b) => sortBest(a, b, minTimeMinutes, maxTimeMinutes, minPrice, maxPrice)
            );
            setParsed(newParsed);
        })
    }, [combos, filter, sort])

    if (props.hidden) return null;

    // Flip all values on the return trip
    const from = props.return ? props.to : props.from;
    const to = props.return ? props.from : props.to;
    const date = props.return ? retDate! : depDate;

    return (
        <section className="flex gap-8">
            <ResultsSidebar
                from={from}
                to={to}
                date={date}
                return={props.return}
            />

            <div className="flex-grow min-w-0">
                <ResultsSortSelector
                    sort={sort}
                    setSort={setSort}
                />

                <section className={cn("flex flex-col gap-4 transition duration-150 xl:max-w-[735px] justify-center", refreshing && 'opacity-50')}>
                    {combos.length === 0 ? (
                        <div className="flex items-center justify-center gap-4 py-24 text-secondary">
                            <Spinner />
                            Loading flights...
                        </div>
                    ) : parsed.map((c, i) => (
                        <ComboCard
                            combo={c}
                            setCombo={props.setSelectedCombo}
                            setShuttleIndex={props.setShuttleIndex}
                            key={c.itinerary.departure_token}
                            firstShuttlePrice={stage == ResultsStage.DEPARTURE ? undefined : depCombo?.shuttleOptions[props.depShuttleIndex!].price}
                        />
                    ))}
                </section>

                <div className="fixed top-0 h-72 w-full bg-gradient-to-b from-background to-transparent pointer-events-none" />
            </div>
        </section>
    )
}
