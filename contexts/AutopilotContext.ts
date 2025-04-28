import { BreakType } from "@prisma/client";
import { createContext } from "react";

export type AutopilotContext = {
    excludedAirlines: string[],
    setExcludedAirlines: (f: string[]) => void,
    excludedSchoolAirports: string[],
    setExcludedSchoolAirports: (f: string[]) => void,
    wantsEmails: boolean,
    setWantsEmails: (f: boolean) => void,
    externalAirports: string[],
    excludedBreaks: BreakType[],
    setExcludedBreaks: (f: BreakType[]) => void
}

export const AutopilotContext = createContext<AutopilotContext>(
    {
        excludedAirlines: [],
        setExcludedAirlines: () => {},
        excludedSchoolAirports: [],
        setExcludedSchoolAirports: () => {},
        wantsEmails: false,
        setWantsEmails: () => {},
        externalAirports: [],
        excludedBreaks: [],
        setExcludedBreaks: () => {}
    }
);