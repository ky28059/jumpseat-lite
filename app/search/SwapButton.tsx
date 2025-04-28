import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";


type SwapButtonProps = {
    pressed: boolean,
    onClick: () => void,
}
export default function SwapButton({ pressed, onClick }: SwapButtonProps) {
    return (
        <button
            className="sm:w-10 w-11 flex-none rounded-md bg-[#f6f9fc] dark:bg-[#333333] sm:static absolute sm:top-0 top-6 z-[1] sm:z-0 sm:left-0 right-10 border-[3px] border-white dark:border-[#141414] sm:border-none"
            onClick={onClick}
        >
            <div className={'transition-transform duration-200 ease-in-out' + (pressed ? ' rotate-[360deg]' : '')}>
                <IoIosArrowForward
                    size={20}
                    className="hidden sm:flex relative top-2 left-[13px] opacity-40"
                    aria-hidden
                />
                <IoIosArrowBack
                    size={20}
                    className="hidden sm:flex sm:relative bottom-[6px] left-[6px] opacity-40"
                    aria-hidden
                />
                <IoIosArrowUp
                    size={18}
                    className="sm:hidden flex relative top-1.5 left-[7px] opacity-40"
                    aria-hidden
                />
                <IoIosArrowDown
                    size={18}
                    className="sm:hidden flex relative bottom-[6px] left-[13px] opacity-40"
                    aria-hidden
                />
            </div>
        </button>
    );
}
