"use client";

import { Dispatch, SetStateAction, HTMLAttributes, MouseEvent, useEffect, useState } from "react";
import { addMonths } from "date-fns";
import { ActiveModifiers, DateRange, SelectRangeEventHandler } from "react-day-picker";

// Components
import { Calendar } from "@/components/ui/calendar";

// Utils
import { cn } from "@/lib/utils";


type DateRangePickerProps = HTMLAttributes<HTMLDivElement> & {
    date?: DateRange,
    setDate: Dispatch<SetStateAction<DateRange | undefined>>,
    numberOfMonths?: number
    showOutsideDays?: boolean
}

export function DateRangePicker({
    className,
    date,
    setDate,
    numberOfMonths = 2,
    showOutsideDays = false
}: DateRangePickerProps) {
    const nextMonth = addMonths(date?.from ?? new Date(), 1);
    const [month, setMonth] = useState(nextMonth);

    useEffect(() => {
        setMonth(date?.from ?? new Date());
    }, [date]);

    const handleSetDate: SelectRangeEventHandler = (
        range: DateRange | undefined,
        selectedDay: Date,
        activeModifiers: ActiveModifiers,
        e: MouseEvent
    ) => {
        // if both dates valid, set new departure date and clear return date
        if (date?.from && date.to) {
            setDate({ from: selectedDay, to: undefined });
        } else if (date?.from && !date.to) {
            // if departure date set and return date set and selected day is greater than departure date, set return date
            if (range?.from && (selectedDay > range?.from)) {
                setDate((range) => ({
                    from: range?.from,
                    to: selectedDay
                }));
            } else {
                // if departure date is set but selected day is before, then reset departure date
                setDate({ from: selectedDay, to: undefined });
            }
        }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Calendar
                initialFocus
                mode="range"
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={handleSetDate}
                numberOfMonths={numberOfMonths}
                showOutsideDays={showOutsideDays}
            />
        </div>
    );
}
