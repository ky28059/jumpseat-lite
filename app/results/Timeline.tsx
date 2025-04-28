import type { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

// Icons
import { MdFlightLand, MdFlightTakeoff } from "react-icons/md";
import { IoMdStopwatch } from "react-icons/io";
import { FaShuttleVan } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Direction } from '@prisma/client';
import { ResultsStage } from '@/contexts/ResultsContext';


type TimelineProps = {
    origin: string,
    destination: string,
    layover?: string
    layoverDuration?: string,
    time: string
    type?: "flight" | "shuttle",
    direction: Direction,
    stage: ResultsStage
}

export function Timeline({ origin, destination, layover, layoverDuration, time, type, direction, stage }: TimelineProps) {
    if (type === 'shuttle') {
        let startColor = "bg-yellow-400";
        let endColor = "bg-lime-400";

        if (direction == "fromSchool" && stage == ResultsStage.DEPARTURE || direction == "toSchool" && stage == ResultsStage.RETURN) {
            startColor = "bg-red-400";
            endColor = "bg-yellow-400";
        }
        return (
            <div className="flex flex-row w-full h-fit max-w-[200px] items-center">
                <TimelineIcon
                    icon={FaShuttleVan}
                    color={startColor}
                    location={origin}
                />
                <div className="flex flex-col items-center mb-3 w-full min-w-[173px] mx-[-10px]">
                    <p className="text-[9px] text-secondary">{time}</p>
                    <hr className="w-full border-t-2 border-tertiary dark:border-secondary" />
                </div>
                <TimelineIcon
                    icon={FaLocationDot}
                    color={endColor}
                    location={destination}
                />
            </div>
        );
    }

    let startColor = "bg-red-400";
    let endColor = "bg-yellow-400";

    if (direction == "fromSchool" && stage == ResultsStage.DEPARTURE || direction == "toSchool" && stage == ResultsStage.RETURN) {
        startColor = "bg-yellow-400";
        endColor = "bg-lime-400";
    }

    if (layover) {
        return (
            <div className="flex flex-row w-full h-fit max-w-[200px] items-center">
                <TimelineIcon
                    icon={MdFlightTakeoff}
                    color={startColor}
                    location={origin}
                />
                <hr className="border-t-2 border-tertiary dark:border-secondary w-[110px] mx-[-10px]" />
                <TimelineIcon
                    icon={IoMdStopwatch}
                    color="bg-orange-400"
                    location={layover}
                    waitTime={layoverDuration}
                />
                <hr className="border-t-2 border-tertiary dark:border-secondary w-full mx-[-10px]" />
                <TimelineIcon
                    icon={MdFlightLand}
                    color={endColor}
                    location={destination}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-row w-full h-fit max-w-[200px] items-center">
            <TimelineIcon
                icon={MdFlightTakeoff}
                color={startColor}
                location={origin}
            />
            <div className="flex flex-col items-center mb-3 w-full mx-[-10px]">
                <p className="text-[9px] text-secondary">{time}</p>
                <hr className="w-full border-t-2 border-tertiary dark:border-secondary" />
            </div>
            <TimelineIcon
                icon={MdFlightLand}
                color={endColor}
                location={destination}
            />
        </div>
    )
}

type TimelineIconProps = {
    location: string,
    color: string,
    icon: IconType,
    waitTime?: string
}

function TimelineIcon({ location, color, icon: Icon, waitTime }: TimelineIconProps) {
    return (
        <div className="relative flex-none flex flex-col items-center justify-end gap-[2px] h-full w-fit z-10">
            {waitTime && (
                <p className="text-[10px] text-secondary absolute -top-4 mb-0.5 w-max">
                    {waitTime}
                </p>
            )}
            <Icon
                className={`text-content h-fit w-fit p-[3px] rounded-full ${color}`}
                size={10}
            />
            <p className="text-[10px] text-secondary absolute -bottom-4 mt-0.5 w-max">
                {location}
            </p>
        </div>
    )
}
