import type { ChangeEvent } from "react";


type TextInputProps = {
    placeholder: string,
    value: string,
    onChange: (value: string) => void,
    className?: string
}
export default function TextInput({ placeholder, value, onChange, className }: TextInputProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    return (
        <input
            type="text"
            className={`py-2 px-3 rounded bg-[#f6f9fc] dark:bg-[#333333] w-full focus:outline-none ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
        />
    );
}
