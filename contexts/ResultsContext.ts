import { createContext } from 'react';
import { Direction } from '@prisma/client';
import type { Combo } from '@/app/results/ComboCard';
import type { Airport } from '@/lib/airports';

export enum ResultsStage {
    DEPARTURE,
    RETURN,
    FINALIZE,
}

export enum SortType {
    FASTEST,
    CHEAPEST,
    BEST
}

type InputValue = {
    name: string,
    value: boolean
}
export type ResultsFilter = {
    departRange: number[],
    arriveRange: number[],

    stops: { [id: string]: InputValue },
    shuttles: { [id: string]: InputValue & { iconUrl: string | null, bookingUrl: string } },

    fromAirports: { [id: string]: InputValue },
    toAirports: { [id: string]: InputValue },
}

type ResultsContext = {
    school: string,
    roundTrip: boolean,
    depDate: string,
    retDate?: string,

    direction: Direction,
    intAirports: string[],
    extAirports: string[],

    depCombo: Combo | null,
    retCombo: Combo | null,
    stage: ResultsStage,

    airportMap: { [iata: string]: Airport }

    filter: ResultsFilter,
    setFilter: (f: ResultsFilter) => void

    carryCnt: number,
    checkCnt: number,

    userID?: number
}
const ResultsContext = createContext<ResultsContext>({
    school: '',
    roundTrip: false,
    depDate: '',

    direction: Direction.fromSchool,
    intAirports: [],
    extAirports: [],

    depCombo: null,
    retCombo: null,
    stage: ResultsStage.DEPARTURE,

    airportMap: {},

    filter: {
        departRange: [], // TODO?
        arriveRange: [],
        stops: {},
        shuttles: {},
        fromAirports: {},
        toAirports: {}
    },
    setFilter: () => {},
    carryCnt: 0,
    checkCnt: 0
});
export default ResultsContext;
