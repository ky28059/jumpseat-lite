"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = false,
    ...props
}: CalendarProps) {
    const navButtonStyle = cn(
        buttonVariants({ variant: "outline" }),
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
    );

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "relative flex flex-col sm:flex-row gap-4",
                month: "space-y-4",
                month_caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "absolute top-0 z-10 w-full flex justify-between",
                button_previous: navButtonStyle,
                button_next: navButtonStyle,
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "flex",
                weekday: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                week: "flex w-full mt-2",
                day: "h-9 w-9 text-center text-sm p-0 relative [&[aria-selected]:has(.day-outside)]:bg-accent/50 [&[aria-selected]]:bg-accent focus-within:relative focus-within:z-20",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                range_start: "rounded-l-md",
                range_end: "rounded-r-md",
                selected: "[&>button]:bg-theme [&>button]:hover:bg-theme text-white hover:text-white [&>button]:focus:bg-theme focus:font-semibold",
                today: "rounded-md bg-accent text-accent-foreground",
                outside: "text-secondary opacity-50",
                disabled: "text-secondary opacity-50",
                range_middle: "[&>button]:bg-transparent [&>button]:hover:bg-transparent aria-selected:bg-accent aria-selected:text-accent-foreground",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) => {
                    if (orientation === 'left')
                        return <ChevronLeft className="h-4 w-4" />;
                    return <ChevronRight className="h-4 w-4" />;
                }
            }}
            {...props}
        />
    )
}

Calendar.displayName = "Calendar";

export { Calendar };
