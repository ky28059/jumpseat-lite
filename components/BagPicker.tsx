import type { Dispatch, SetStateAction } from 'react';

// Components
import InputPlusMinus from '@/components/InputPlusMinus';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Icons
import { IoIosArrowDown } from 'react-icons/io';
import { MdLuggage } from 'react-icons/md';


type BagPickerProps = {
    numCheckIn: number,
    setNumCheckIn: Dispatch<SetStateAction<number>>,
    numCarryOn: number,
    setNumCarryOn: Dispatch<SetStateAction<number>>
}
export default function BagPicker(props: BagPickerProps) {
    const totalBags = props.numCarryOn + props.numCheckIn;

    return (
        <Popover>
            <PopoverTrigger className="w-[7.5rem] h-fit flex-none px-2 py-1.5 bg-[#f6f9fc] dark:bg-[#333333] rounded-sm flex gap-2 items-center">
                <MdLuggage className="flex-none" />
                <span className="self-center flex-none text-sm">
                    {totalBags} bag{totalBags !== 1 ? 's' : ''}
                </span>
                <IoIosArrowDown
                    size={15}
                    className="size-4 flex-none ml-auto opacity-50"
                    aria-hidden="true"
                />
            </PopoverTrigger>
            <PopoverContent
                className="w-fit dark:border-[#353535] grid grid-cols-2 items-center gap-x-2 gap-y-1"
                align="end"
            >
                <p className="text-sm">
                    Checked bags
                </p>
                <InputPlusMinus
                    value={props.numCheckIn}
                    setValue={props.setNumCheckIn}
                />

                <p className="text-sm">
                    Carry-ons
                </p>
                <InputPlusMinus
                    value={props.numCarryOn}
                    setValue={props.setNumCarryOn}
                />
            </PopoverContent>
        </Popover>
    )
}
