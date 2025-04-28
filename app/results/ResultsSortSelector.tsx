import type { ReactNode } from 'react';
import { SortType } from '@prisma/client';
import { cn } from '@/lib/utils';


type ResultsSortSelectorProps = {
    sort: SortType,
    setSort: (s: SortType) => void
}
export default function ResultsSortSelector(props: ResultsSortSelectorProps) {
    return (
        <div className="flex z-20 rounded border border-tertiary py-2 mb-4 divide-x divide-tertiary sticky top-20 bg-background shadow-lg xl:max-w-[735px] -mx-1">
            <ResultsSortTab
                name="Best"
                value={SortType.BEST}
                {...props}
            >
                <span className="hidden sm:inline">Sort by price and trip duration.</span>
                <span className="sm:hidden">Price and time.</span>
            </ResultsSortTab>
            <ResultsSortTab
                name="Cheapest"
                value={SortType.CHEAPEST}
                {...props}
            >
                <span className="hidden sm:inline">Sort by price only.</span>
                <span className="sm:hidden">Price only.</span>
            </ResultsSortTab>
            <ResultsSortTab
                name="Fastest"
                value={SortType.FASTEST}
                {...props}
            >
                <span className="hidden sm:inline">Sort by trip duration only.</span>
                <span className="sm:hidden">Duration only.</span>
            </ResultsSortTab>
        </div>
    )
}

type ResultsSortTabProps = {
    name: string,
    sort: SortType,
    value: SortType,
    setSort: (v: SortType) => void,
    children: ReactNode
}
function ResultsSortTab(props: ResultsSortTabProps) {
    const active = props.sort === props.value;

    return (
        <div className="flex flex-grow w-1/3 px-2">
            <button
                className="w-full flex flex-col items-stretch text-center rounded pt-2 hover:bg-content transition duration-200"
                onClick={() => props.setSort(props.value)}
            >
                <h2 className="font-semibold px-1.5 sm:px-4">
                    {props.name}
                </h2>
                <p className="text-xs text-secondary px-1.5 sm:px-4 mb-auto">
                    {props.children}
                </p>
                <div
                    className={cn(
                        "h-1 w-full rounded-full mt-2 transition duration-150",
                        active && "bg-theme"
                    )}
                />
            </button>
        </div>
    )
}
