"use client";

import { useState } from "react";

// Components
import ResultsBreadcrumbs from "@/app/results/ResultsBreadcrumbs";
import DecideContent from "@/app/results/DecideContent";
import FinalizeContent from '@/app/results/FinalizeContent';

// Contexts
import ResultsContext, { ResultsFilter, ResultsStage } from "@/contexts/ResultsContext";

// Utils
import type { Direction } from '@prisma/client';
import type { Combo } from '@/app/results/ComboCard';
import type { Airport } from '@/lib/airports';


type ResultsContentProps = {
    roundTrip: boolean,
    airportMap: { [iata: string]: Airport }

    from: string,
    to: string,
    fromAirports: { [code: string]: { name: string, value: boolean } },
    toAirports: { [code: string]: { name: string, value: boolean } },
    shuttleProviders: { [id: string]: { name: string, value: boolean, iconUrl: string | null, bookingUrl: string } },

    school: string,
    direction: Direction
    intAirports: string[],
    extAirports: string[],
    depDate: string,
    retDate?: string,
    
    depRange: number[],
    arrRange: number[],

    carryCnt: number,
    checkCnt: number,
    schoolID: number,
    userID?: number
};
export default function ResultsContent(props: ResultsContentProps) {
    const [stage, setStage] = useState(ResultsStage.DEPARTURE);
    const [filter, setFilter] = useState<ResultsFilter>({
        departRange: props.depRange,
        arriveRange: props.arrRange,
        stops: {
            "stops-none": {
                name: "Nonstop",
                value: true,
            },
            "stops-one": {
                name: "1 stop",
                value: true,
            },
            "stops-mult": {
                name: "Multiple stops",
                value: false,
            },
        },
        shuttles: props.shuttleProviders,
        fromAirports: props.fromAirports,
        toAirports: props.toAirports,
    });

    const [depCombo, setDepCombo] = useState<Combo | null>(null);
    const [depShuttleIndex, setDepShuttleIndex] = useState(0);

    const [retCombo, setRetCombo] = useState<Combo | null>(null);
    const [retShuttleIndex, setRetShuttleIndex] = useState(0);

    const [analyticsID, setAnalyticsID] = useState<number>(-1);

    const [servicesClicked, setServicesClicked] = useState<string[]>([]);

    function selectDepCombo(c: Combo) {
        setDepCombo(c);
        setStage(props.roundTrip ? ResultsStage.RETURN : ResultsStage.FINALIZE)
    }

    function selectRetCombo(c: Combo) {
        setRetCombo(c);
        setStage(ResultsStage.FINALIZE)
    }

    return (
        <ResultsContext.Provider
            value={{
                school: props.school,
                roundTrip: props.roundTrip,
                depDate: props.depDate,
                retDate: props.retDate,
                direction: props.direction,
                intAirports: props.intAirports,
                extAirports: props.extAirports,
                airportMap: props.airportMap,
                depCombo,
                retCombo,
                stage,
                filter,
                setFilter,
                carryCnt: props.carryCnt,
                checkCnt: props.checkCnt,
                analyticsID,
                setAnalyticsID,
                userID: props.userID,
                servicesClicked: servicesClicked,
                setServicesClicked: setServicesClicked
            }}
        >
            <ResultsBreadcrumbs setStage={setStage} />

            <DecideContent
                {...props}
                selectedCombo={depCombo}
                setSelectedCombo={selectDepCombo}
                setShuttleIndex={setDepShuttleIndex}
                hidden={stage !== ResultsStage.DEPARTURE}
            />
            {props.roundTrip && (
                <DecideContent
                    return
                    {...props}
                    depFlight={depCombo?.itinerary}
                    selectedCombo={retCombo}
                    setSelectedCombo={selectRetCombo}
                    setShuttleIndex={setRetShuttleIndex}
                    hidden={stage !== ResultsStage.RETURN}
                    depShuttleIndex={depShuttleIndex}
                />
            )}
            <FinalizeContent
                from={props.from}
                to={props.to}
                depShuttleIndex={depShuttleIndex}
                retShuttleIndex={retShuttleIndex}
                hidden={stage !== ResultsStage.FINALIZE}
            />
        </ResultsContext.Provider>
    );
}
