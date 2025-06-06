"use client"

import { useRef } from "react";
import { useDateSegment } from "react-aria";
import { DateFieldState, DateSegment as IDateSegment } from "react-stately";
import { cn } from "@/lib/utils";

interface DateSegmentProps {
    segment: IDateSegment;
    state: DateFieldState;
}

function DateSegment({ segment, state }: DateSegmentProps) {
    const ref = useRef(null);

    const {
        segmentProps: { ...segmentProps },
    } = useDateSegment(segment, state, ref);

    return (
        <div
            {...segmentProps}
            ref={ref}
            aria-label="Time Input"
            className={cn(
                "focus:rounded-[2px] focus:bg-[#abc7e3] focus:text-accent-foreground focus:outline-none",
                segment.type !== "literal" ? "px-[1px]" : "",
                segment.isPlaceholder ? "text-secondary" : ""
            )}
        >
            {segment.text}
        </div>
    );
}

export { DateSegment };
