'use client'

import { useContext, useState } from 'react';
import { addMinutes, format } from 'date-fns';
import { cn } from '@/lib/utils';

// Components
import LabeledCheckbox from '@/components/LabeledCheckbox';
import TimeRangeSlider from '@/components/TimeRangeSlider';

// Contexts
import ResultsContext, { ResultsFilter } from '@/contexts/ResultsContext';

// Icons
import { IoFilter } from 'react-icons/io5';


type ResultsSidebarProps = {
    from: string,
    to: string,
    date: string,
    return?: boolean
}
export default function ResultsSidebar(props: ResultsSidebarProps) {
    const { filter, setFilter } = useContext(ResultsContext);
    const [open, setOpen] = useState(false);

    const baseDate = new Date(0, 0, 0);
    function formatMinuteRange(range: number[]) {
        const formatMinutes = (m: number) => {
            const date = addMinutes(baseDate, m);
            return format(date, 'h:mm aa');
        }

        return `${formatMinutes(range[0])} — ${formatMinutes(range[1])}`
    }

    function updateDepartRange(r: number[]) {
        const newFilter = structuredClone(filter);
        newFilter.departRange = r;
        setFilter(newFilter);
    }

    function updateArriveRange(r: number[]) {
        const newFilter = structuredClone(filter);
        newFilter.arriveRange = r;
        setFilter(newFilter);
    }

    // TODO: overkill?
    type ResultsFilterCheckboxFields = { [K in keyof ResultsFilter as ResultsFilter[K] extends { [id: string]: object } ? K : never]: ResultsFilter[K] };
    function setCheckboxField(c: keyof ResultsFilterCheckboxFields, n: string, value: boolean) {
        const newFilter = structuredClone(filter);
        newFilter[c][n].value = value;
        setFilter(newFilter);
    }

    const fromAirports = Object.entries(filter.fromAirports);
    const toAirports = Object.entries(filter.toAirports);
    const shuttles = Object.entries(filter.shuttles);

    // Number of checkboxes in the from / to airports and shuttles section that are currently checked.
    const fromChecked = fromAirports.filter(([, d]) => d.value).length;
    const toChecked = toAirports.filter(([, d]) => d.value).length;
    const shuttlesChecked = shuttles.filter(([, d]) => d.value).length;

    const fromCheckboxes = fromAirports.map(([id, d]) => (
        <LabeledCheckbox
            checked={d.value}
            onChange={setCheckboxField.bind(null, 'fromAirports', id)}
            disabled={d.value && fromChecked === 1}
            id={id}
            key={id}
        >
            {d.name}
        </LabeledCheckbox>
    ));

    const toCheckboxes = toAirports.map(([id, d]) => (
        <LabeledCheckbox
            checked={d.value}
            onChange={setCheckboxField.bind(null, 'toAirports', id)}
            disabled={d.value && toChecked === 1}
            id={id}
            key={id}
        >
            {d.name}
        </LabeledCheckbox>
    ));

    return (
        <aside
            className={cn(
                "fixed lg:sticky inset-y-0 left-0 lg:top-20 bg-background z-50 lg:z-0 py-16 lg:py-0 lg:w-64 flex-none lg:pr-6 border-r border-tertiary lg:h-max lg:max-h-[calc(100vh_-_6.5rem)] overflow-y-scroll scrollbar:w-1 scrollbar-thumb:bg-tertiary hover:scrollbar-thumb:bg-secondary scrollbar-thumb:transition scrollbar-thumb:duration-200 transition-[width] duration-200 overflow-x-hidden",
                open ? "w-64 pr-6" : "w-0"
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
                <h1 className="font-semibold text-2xl mb-1">
                    {props.from} {'<->'} {props.to}
                </h1>
                <h2 className="text-secondary">
                    {props.date}
                </h2>

                <hr className="border-tertiary my-5" />

                <h2 className="font-semibold mb-3">
                    Stops
                </h2>
                {Object.entries(filter.stops).map(([id, d]) => (
                    <LabeledCheckbox
                        checked={d.value}
                        onChange={setCheckboxField.bind(null, 'stops', id)}
                        id={id}
                        key={id}
                    >
                        {d.name}
                    </LabeledCheckbox>
                ))}

                <hr className="border-tertiary my-5" />

                <h2 className="font-semibold mb-3">
                    Shuttle services
                </h2>
                {shuttles.map(([id, d]) => (
                    <LabeledCheckbox
                        checked={d.value}
                        onChange={setCheckboxField.bind(null, 'shuttles', id)}
                        disabled={d.value && shuttlesChecked === 1}
                        id={id}
                        key={id}
                    >
                        {d.name}
                    </LabeledCheckbox>
                ))}

                <hr className="border-tertiary my-5" />

                <h2 className="font-semibold mb-2">
                    Trip time
                </h2>
                <p className="text-xs text-secondary mb-1">Depart between (EST):</p>
                <TimeRangeSlider
                    minutes={filter.departRange}
                    setMinutes={updateDepartRange}
                />
                <p className="text-xs text-secondary mt-2">
                    {formatMinuteRange(filter.departRange)}
                </p>

                <p className="text-xs text-secondary mb-1 mt-4">Arrive between (PST):</p>
                <TimeRangeSlider
                    minutes={filter.arriveRange}
                    setMinutes={updateArriveRange}
                />
                <p className="text-xs text-secondary mt-2">
                    {formatMinuteRange(filter.arriveRange)}
                </p>

                <hr className="border-tertiary my-5" />

                <h2 className="font-semibold mb-3">
                    Airports
                </h2>

                <h3 className="font-medium mb-2 text-sm">
                    Departing
                </h3>
                {props.return ? toCheckboxes : fromCheckboxes}

                <h3 className="font-medium mt-4 mb-2 text-sm">
                    Arriving
                </h3>
                {props.return ? fromCheckboxes : toCheckboxes}
            </div>
        </aside>
    )
}
