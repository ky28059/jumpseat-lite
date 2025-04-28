import type { Dispatch, SetStateAction } from 'react';

// Components
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { FaLocationArrow } from 'react-icons/fa6';


type TypePickerProps = {
    type: string,
    setType: Dispatch<SetStateAction<string>>,
    possibleTypes: string[],
    isAutopilot: boolean
}

export default function TypePicker(props: TypePickerProps) {
    return (
        <Select value={props.type} onValueChange={props.setType}>
            <SelectTrigger className={`h-fit w-[8.5rem] flex-none px-2 py-1.5 bg-[#f6f9fc] border-none ${props.isAutopilot ? "dark:bg-[#141414]" : "dark:bg-[#333333]"} rounded-sm`}>
                <FaLocationArrow />
                {props.type}
            </SelectTrigger>
            <SelectContent>
                {props.possibleTypes.map((o) => (
                    <SelectItem value={o} key={o}>
                        {o}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
