import { useState, useRef, useEffect, ChangeEvent } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type EditableTextInputProps = {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    type: string;
};

export default function EditableTextInput({ placeholder, value, onChange, className, type }: EditableTextInputProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const inputRef = useRef<HTMLInputElement>(null);
    const previousValueRef = useRef(value);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleConfirm = () => {
        setIsEditing(false);
        if (inputValue !== previousValueRef.current) {
            onChange(inputValue);
        }
        previousValueRef.current = inputValue;
    };

    const handleCancel = () => {
        setIsEditing(false);
        setInputValue(previousValueRef.current);
    };

    const handleTextClick = () => {
        setIsEditing(true);
    };

    const defaultPasswordPlaceholder = "•".repeat(8);

    return (
        <div className="relative flex-grow sm:w-full md:w-auto">
            {isEditing ? (
                <div className="flex items-center">
                    <input
                        ref={inputRef}
                        type={type === "password" ? "password" : "text"}
                        className={`py-2 px-3 rounded bg-[#f6f9fc] dark:bg-content-secondary w-full focus:outline-none ${className}`}
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleConfirm} className="ml-2 text-green-600">
                        <CheckCircle size={20} />
                    </button>
                    <button onClick={handleCancel} className="ml-2 text-red-600">
                        <XCircle size={20} />
                    </button>
                </div>
            ) : (
                <div className={`py-2 px-3 rounded bg-[#f6f9fc] dark:bg-content-secondary w-full ${className}`} onClick={handleTextClick}>
                    {type === "password" ? defaultPasswordPlaceholder : value || placeholder}
                </div>
            )}
        </div>
    );
}
