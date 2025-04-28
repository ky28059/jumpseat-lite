'use client'

import { useContext, useState } from 'react';
import { cn } from '@/lib/utils';

// Components
import LabeledCheckbox from '@/components/LabeledCheckbox';
import { Switch } from "@/components/ui/switch";

// Contexts
import { AutopilotContext } from '@/contexts/AutopilotContext';

// Icons
import { IoFilter } from 'react-icons/io5';

// Lib
import { updateProfile } from '@/lib/db/user';
import { BreakType } from '@prisma/client';

interface AutopilotSidebarProps {
    uniqueAirlines: string[];
    schoolAirports: string[];
    activeBreaks: BreakType[];
    isTest: boolean;
}

const reverseAirlineCodeMap: { [name: string]: string } = {
    "United": "UA",
    "American": "AA",
    "Alaska": "AS",
    "Sun Country": "SY",
    "Delta": "DL",
    "JetBlue": "B6",
    "Southwest": "WN",
    "Lufthansa": "LH",
    "Frontier": "F9",
    "Spirit": "NK",
    "Allegiant": "G4"
}

export default function AutopilotSidebar({ uniqueAirlines, schoolAirports, activeBreaks, isTest }: AutopilotSidebarProps) {

    const { excludedAirlines, setExcludedAirlines, wantsEmails, setWantsEmails, excludedSchoolAirports, setExcludedSchoolAirports, excludedBreaks, setExcludedBreaks } = useContext(AutopilotContext);

    const [open, setOpen] = useState(false);

    return (
        <aside
            className={cn(
                "fixed lg:sticky inset-y-0 left-0 lg:top-20 bg-background z-30 lg:z-0 py-16 lg:py-0 lg:w-64 flex-none lg:pr-6 border-r border-tertiary lg:h-max lg:max-h-[calc(100vh_-_6.5rem)] overflow-y-scroll scrollbar:w-1 scrollbar-thumb:bg-tertiary hover:scrollbar-thumb:bg-secondary scrollbar-thumb:transition scrollbar-thumb:duration-200 transition-[width] duration-200 overflow-x-hidden",
                open ? "w-64 pr-6" : "w-0",
                isTest ? "pointer-events-none select-none" : ""
            )}
        >
            <button
                className={cn(
                    "fixed lg:hidden transition-[left] duration-200 bg-background p-3 rounded-r border border-l-0 -ml-px border-tertiary text-2xl",
                    open ? "left-64" : "left-0"
                )}
                onClick={() => setOpen(!open)}
            >
                <IoFilter />
            </button>

            <div className="w-56 pl-6 lg:pl-0">
                <h1 className="font-semibold text-2xl text-primary">
                    Autopilot
                </h1>
                {/* <h4 className="text-secondary">
                    Automatic flight price tracking for your breaks
                </h4> */}

                <hr className="border-tertiary my-5"/>

                <h2 className="font-semibold mb-3">
                    Breaks
                    {/* we want to get the set of breaks that we are tracking for the school this user attends, box is checked  */}
                </h2>

                {activeBreaks.map((ab, index) => (
                    <LabeledCheckbox
                            checked={!(excludedBreaks.includes(ab))}
                            onChange={(checked) => {
                                let newExcludedBreaks: BreakType[] = [];
                                if (checked) {
                                    newExcludedBreaks = excludedBreaks.filter(item => item != ab);
                                } else {
                                    newExcludedBreaks = [...excludedBreaks, ab];
                                }
                                setExcludedBreaks(newExcludedBreaks);
                                updateProfile("excludedBreaks", newExcludedBreaks);
                            }}
                            id={String(index)}
                            key={index}
                    >
                        {ab}
                    </LabeledCheckbox>
                ))}

                <hr className="border-tertiary my-5"/>

                <h2 className="font-semibold mb-3">
                    Airlines
                </h2>
                {uniqueAirlines.map((airline, index) => (
                        <LabeledCheckbox
                                checked={!(excludedAirlines.includes(reverseAirlineCodeMap[airline]))}
                                onChange={(checked) => {
                                    let newExcludedAirlines = [];
                                    if (checked) {
                                        newExcludedAirlines = excludedAirlines.filter(item => item != reverseAirlineCodeMap[airline]);
                                    } else {
                                        newExcludedAirlines = [...excludedAirlines, reverseAirlineCodeMap[airline]];
                                    }
                                    setExcludedAirlines(newExcludedAirlines);
                                    updateProfile("excludedAirlines", newExcludedAirlines);
                                }}
                                id={String(index)}
                                key={index}
                        >
                            {airline}
                        </LabeledCheckbox>
                ))}

                <hr className="border-tertiary my-5"/>

                <div className="flex flex-row gap-4 justify-between pr-2">
                    <h2 className="font-semibold">
                        Emails
                    </h2>
                    <Switch
                            checked={wantsEmails}
                            onCheckedChange={(checked: boolean) => {
                                setWantsEmails(checked);
                                updateProfile("wantsEmails", checked);
                            }}
                    />
                </div>

                <hr className="border-tertiary my-5"/>

                <h2 className="font-semibold mb-2">
                    School airport(s)
                </h2>
                {schoolAirports.map((airport, index) => (
                        <LabeledCheckbox
                                checked={!(excludedSchoolAirports.includes(airport))}
                                onChange={(checked) => {
                                    let newExcludedAirports: string[] = [];
                                    if (checked) {
                                        newExcludedAirports = excludedSchoolAirports.filter(item => item != airport);
                                    } else {
                                        // ensure that it's not empty
                                        if (excludedSchoolAirports.length == 1)
                                            return
                                        newExcludedAirports = [...excludedSchoolAirports, airport];
                                    }
                                    setExcludedSchoolAirports(newExcludedAirports);
                                    updateProfile("excludedAirports", newExcludedAirports);
                                }}
                                id={String(index)}
                                key={index}
                        >
                            {airport}
                        </LabeledCheckbox>
                ))}

                <hr className="border-tertiary my-5"/>
            </div>
        </aside>
    )
}
