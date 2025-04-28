import type {ReactNode} from 'react';
import {BsPlus, BsX} from 'react-icons/bs';
import {MdArrowBack, MdArrowForward, MdRefresh} from 'react-icons/md';


type MockPageProps = {
    left?: boolean,
    children: ReactNode,
    className?: string
}
export default function MockPage(props: MockPageProps) {
    return (
        <div className="rounded-lg border border-tertiary bg-content shadow-xl w-full lg:w-[36rem] xl:w-[46rem] flex-none">
            <div className="flex gap-2 items-center pt-2 pb-1.5 px-4 border-b border-tertiary bg-gray-100 dark:bg-background/75 rounded-t-lg">
                <div className="size-2.5 rounded-full bg-red-500" />
                <div className="size-2.5 rounded-full bg-yellow-500" />
                <div className="size-2.5 rounded-full bg-lime-500" />

                <div className="ml-2 flex items-center gap-6 text-xs text-secondary font-medium border-x border-t border-tertiary rounded-t-md px-3.5 py-2 -mb-[calc(0.375rem_+_1px)] bg-content">
                    Jumpseat
                    <BsX className="text-base" />
                </div>
                <BsPlus />
            </div>
            <div className="flex items-center py-1.5 gap-2 px-4 border-b border-tertiary text-secondary">
                <MdArrowBack />
                <MdArrowForward />
                <MdRefresh />
                <div className="ml-2 h-6 rounded-full bg-gray-200 dark:bg-background/75 w-full border border-tertiary" />
            </div>

            <div className={'px-6 sm:px-12 pt-4 sm:pt-8 pb-8' + (props.className ? ` ${props.className}` : '')}>
                {props.children}
            </div>
        </div>
    )
}
