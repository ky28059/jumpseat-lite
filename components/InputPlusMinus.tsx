import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { FiMinus, FiPlus } from "react-icons/fi";


type InputPlusMinusProps = {
    value: number,
    setValue: Dispatch<SetStateAction<number>>
}
export default function InputPlusMinus({ value, setValue }: InputPlusMinusProps) {
    const decreaseValue = () => {
        setValue((prevValue) => Math.max(prevValue - 1, 0));
    }

    const increaseValue = () => {
        setValue((prevValue) => prevValue + 1);
    }

    const updateValue = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (isNaN(value) || value < 0) return;
        setValue(value);
    }

    return (
        <div className="flex flex-row align-center w-fit gap-1">
            <button
                className="px-1 py-1 h-fit bg-theme flex gap-4 items-center self-center rounded-full text-white disabled:opacity-50 transition duration-100"
                onClick={decreaseValue}
                disabled={value === 0}
            >
                <FiMinus size={10} />
            </button>
            <Input
                className="w-[40px] p-1.5 text-center dark:bg-[#333333]"
                value={value}
                onChange={updateValue}
            />
            <button
                className="px-1 py-1 h-fit bg-theme flex gap-4 items-center self-center rounded-full text-white"
                onClick={increaseValue}
            >
                <FiPlus size={10} />
            </button>
        </div>
    );
}
