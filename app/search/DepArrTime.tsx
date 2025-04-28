import type { Dispatch, SetStateAction } from "react";
import { TimeValue } from "react-aria";

// Components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TimePicker } from "@/components/time-picker/time-picker";
import { BreakType } from "@prisma/client";


type DepArrTimeProps = {
    breakOption: BreakType | "custom"
    depTime: TimeValue | undefined
    setDepTime: Dispatch<SetStateAction<TimeValue | undefined>>
    arrTime: TimeValue | undefined
    setArrTime: Dispatch<SetStateAction<TimeValue | undefined>>
}

export default function DepArrTime({ breakOption, depTime, setDepTime, arrTime, setArrTime }: DepArrTimeProps) {
    if (breakOption !== "custom") {
        return (
            <div className="flex flex-col sm:flex-row align-center h-full sm:gap-4 gap-2">
                <div className="flex flex-row w-fit">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <p className="h-fit self-center mr-2 text-sm sm:text-base">
                                    Departure Time
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm sm:text-base">
                                    The time you want leave school.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TimePicker
                        onChange={(value) => setDepTime(value)}
                        value={depTime}
                    />
                </div>
                <div className="flex flex-row w-fit">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <p className="h-fit self-center mr-2 text-sm sm:text-base">
                                    Arrival Time
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-sm sm:text-base">
                                    The time you want to get back to school.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TimePicker
                        onChange={(value) => setArrTime(value)}
                        value={arrTime}
                    />
                </div>
            </div>
        )
    }
    return (
        <div></div>
    )
}
