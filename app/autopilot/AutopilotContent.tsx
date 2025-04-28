"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AutopilotSidebar from "@/app/autopilot/AutopilotSidebar";
import BreakCard from "@/app/autopilot/BreakCard";
import OnboardingModal from "@/app/autopilot/OnboardingModal";
import { Button } from "@/components/ui/button";
// import EmailWarningAlert from '@/app/autopilot/EmailWarningAlert';
import Spinner from "@/components/Spinner";

// Utils
import { getUserBreaksWithFlights, UserBreakWithBreakRouteAndFlight } from "@/lib/db/userBreak";

// Contexts
import { AutopilotContext } from "@/contexts/AutopilotContext";
import { User, BreakType } from "@prisma/client";
import { SchoolConfig } from "@/lib/schools";

export const testUser: User = {
    id: 678,
    email: "bruhbruh25@gmail.com",
    password: "",
    isVerified: true,
    inAutopilot: true,
    isAdmin: false,
    firstName: "bruh",
    lastName: "bruh",
    createdAt: new Date("1970-01-01"),
    airports: ["LAX"],
    schoolID: 1,
    onSniperBeta: false,
    personalEmail: "bruhbruh25@gmail.com",
    isPersonalEmailVerified: true,
    excludedAirlines: [],
    excludedAirports: [],
    excludedBreaks: [],
    wantsEmails: true
}

interface AutopilotContentProps {
    user: User;
    isTest: boolean;
    config?: SchoolConfig;
}

const airlineCodeMap: { [name: string]: string } = {
    "UA": "United",
    "AA": "American",
    "AS": "Alaska",
    "SY": "Sun Country",
    "DL": "Delta",
    "B6": "JetBlue",
    "WN": "Southwest",
    "LH": "Lufthansa",
    "F9": "Frontier",
    "NK": "Spirit",
    "G4": "Allegiant"
}

export function convertTimezone(inputDate: Date) {
    return new Date(inputDate.getTime() + inputDate.getTimezoneOffset() * 60 * 1000);
}

const autopilotAirports: string[] = ["SFO", "LAX", "BOS", "EWR", "DFW", "IAH", "ATL", "JFK", "LGA", "PHL", "IAD", "DCA", "BWI", "MIA", "SEA"];

export default function AutopilotContent({ user, isTest, config }: AutopilotContentProps) {

    const [inAutopilot, setInAutopilot] = useState(user.inAutopilot);
    const emailWarning = user.inAutopilot ? user?.personalEmail === "" : false;
    const [userBreaks, setUserBreaks] = useState<UserBreakWithBreakRouteAndFlight[]>([]);
    const [excludedAirlines, setExcludedAirlines] = useState<string[]>(user.excludedAirlines);
    const [excludedSchoolAirports, setExcludedSchoolAirports] = useState<string[]>(user.excludedAirports);
    const [excludedBreaks, setExcludedBreaks] = useState<BreakType[]>(user.excludedBreaks);
    const [wantsEmails, setWantsEmails] = useState<boolean>(user.wantsEmails);
    const [uniqueAirlines, setUniqueAirlines] = useState<string[]>([]);
    const [schoolAirports, setSchoolAirports] = useState<string[]>([]);
    const [activeBreaks, setActiveBreaks] = useState<BreakType[]>([]);
    const airportsSelected = inAutopilot ? user?.airports.length !== 0 : true;
    const airportValid = inAutopilot ? user?.airports.some((airport) => autopilotAirports.includes(airport)) : true;

    useEffect(() => {
        const _getUserBreaksWithFlights = async () => {
            setUserBreaks([]);
            const _userBreaks = await getUserBreaksWithFlights(inAutopilot ? user.airports : testUser.airports, inAutopilot ? user.id : testUser.id);
            if (_userBreaks) {
                let newUniqueAirlines: string[] = [];
                let newActiveBreaks: BreakType[] = [];
                for (let userBreak of _userBreaks) {
                    for (let bor of userBreak.break.routes) {
                        bor.route.depDate = convertTimezone(bor.route.depDate);
                        for (let flight of bor.route.flights) {
                            try {
                                flight.depTime = convertTimezone(flight.depTime);
                                flight.arrTime = convertTimezone(flight.arrTime);
                                if (!newUniqueAirlines.includes(airlineCodeMap[flight.airline])) {
                                    newUniqueAirlines.push(airlineCodeMap[flight.airline]);
                                }
                            }
                            catch (e) {
                                continue;
                            }
                        }
                    }
                    userBreak.break.defaultStartDate = convertTimezone(userBreak.break.defaultStartDate);
                    userBreak.break.defaultEndDate = convertTimezone(userBreak.break.defaultEndDate);
                    userBreak.break.realStartDate = convertTimezone(userBreak.break.realStartDate);
                    userBreak.break.realEndDate = convertTimezone(userBreak.break.realEndDate);

                    // convert the preference times to local timezone
                    userBreak.depStartTime = convertTimezone(userBreak.depStartTime);
                    userBreak.depEndTime = convertTimezone(userBreak.depEndTime);
                    userBreak.retStartTime = convertTimezone(userBreak.retStartTime);
                    userBreak.retEndTime = convertTimezone(userBreak.retEndTime);

                    // add to the set of active breaks
                    newActiveBreaks.push(userBreak.break.breakType);
                }
                setUserBreaks(_userBreaks);
                setUniqueAirlines(newUniqueAirlines.sort());
                setSchoolAirports(_userBreaks[0].break.school.airportIatas);
                setActiveBreaks(newActiveBreaks);
            }
        }
        if ((inAutopilot && airportsSelected && airportValid) || (!inAutopilot)) {
            void _getUserBreaksWithFlights();
        }
    }, [inAutopilot, excludedBreaks]);

    if (inAutopilot && !airportsSelected || !airportValid) {
        return (
                <div className={isTest ? "pointer-events-none select-none" : ""}>
                    <Alert variant="destructive" className="flex items-center justify-between mt-20 w-[90%] ml-auto mr-auto sm:w-full">
                        <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <div>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {
                                        airportsSelected ?
                                        "Your default airport is not supported. Please send us a request. If you just changed your airport, please refresh in a few seconds." : 
                                        "You have no home airport selected. Please select your default airport on the account page. If you already selected one, please refresh in a few seconds."
                                    }
                                </AlertDescription>
                            </div>
                        </div>
                        {
                            airportsSelected ?
                            <Button variant="link"
                                    className="ml-4 bg-white dark:bg-[#141414] text-[#ef4444] border border-destructive">
                                <a
                                    className="p-3 rounded transition duration-100"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="mailto:team@jumpseatapp.com"
                                >
                                    Contact us
                                </a>
                            </Button>
                            :
                            <Link href="/account" passHref>
                                <Button variant="link"
                                        className="ml-4 bg-white dark:bg-[#141414] text-[#ef4444] border border-destructive">
                                    {
                                        airportsSelected ? 
                                        "Contact us" : 
                                        "Go to Account"
                                    }
                                </Button>
                            </Link>
                        }
                    </Alert>
                </div>
        )
    }

    return (
        <AutopilotContext.Provider value={
            {
                excludedAirlines: excludedAirlines,
                setExcludedAirlines: setExcludedAirlines,
                excludedSchoolAirports: excludedSchoolAirports,
                setExcludedSchoolAirports: setExcludedSchoolAirports,
                wantsEmails: wantsEmails,
                setWantsEmails: setWantsEmails,
                externalAirports: user.airports,
                excludedBreaks: excludedBreaks,
                setExcludedBreaks: setExcludedBreaks
            }
        }>
            <div className="mt-32">
                {
                    userBreaks.length > 0 ? 
                    <div>
                        <div className={`flex ${isTest || !inAutopilot ? "blur" : ""}`}>
                            <AutopilotSidebar uniqueAirlines={uniqueAirlines} schoolAirports={schoolAirports} activeBreaks={activeBreaks} isTest={isTest || !inAutopilot} />
                            <div className="flex flex-col gap-4 items-center md:ml-8">
                                {/* {emailWarning && inAutopilot && <EmailWarningAlert />} */}
                                {userBreaks?.filter((ub) => !excludedBreaks.includes(ub.break.breakType)).map((userBreak) => (
                                    <BreakCard
                                        inputUserBreak={userBreak}
                                        inputRoutes={userBreak.break.routes.map(bor => bor.route)}
                                        key={userBreak.break.breakType}
                                        isTest={isTest || !inAutopilot}
                                    />
                                ))}
                            </div>
                        </div>
                        {!inAutopilot && <OnboardingModal isSigned={true} setInAutopilot={setInAutopilot} config={config} />}
                    </div>
                    :
                    <section className="flex items-center justify-center gap-4 py-24 text-secondary h-[540px]">
                        <Spinner />
                        Loading Autopilot...
                    </section>
                }
            </div>
        </AutopilotContext.Provider>
    )
}