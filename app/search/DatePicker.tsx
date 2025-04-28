import { Calendar } from "@/components/ui/calendar";


type DatePickerProps = {
    date: Date | undefined,
    setDate: (value: Date | undefined) => void,
    showOutsideDays?: boolean
    numberOfMonths?: number
};

export function DatePicker({
    date,
    setDate,
    showOutsideDays = false,
    numberOfMonths = 2
}: DatePickerProps) {
    return (
        <Calendar
            mode="single"
            selected={date}
            month={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
            showOutsideDays={showOutsideDays}
        />
    );
}
