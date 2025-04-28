import type { IconType } from "react-icons";

// Icons
import { IoAlertCircleSharp } from "react-icons/io5";
import { FaBus, FaUserFriends } from "react-icons/fa";


type InfoBoxProps = {
    title: string,
    description: string,
    icon: IconType
}
export default function InfoBox({ title, description, icon }: InfoBoxProps) {
    const IconComponent = icon || IoAlertCircleSharp;

    return (
        <div className="flex flex-col flex-1">
            <div className="mb-5 ml-3">
                <svg width="0" height="0">
                    <linearGradient
                        id="blue-gradient"
                        x1="100%"
                        y1="100%"
                        x2="0%"
                        y2="0%"
                    >
                        <stop stopColor="#1e40af" offset="0%" />
                        <stop stopColor="#3a84f5" offset="100%" />
                    </linearGradient>
                </svg>
                <IconComponent
                    size={icon == FaBus ? 26 : 30}
                    style={{ fill: "url(#blue-gradient)" }}
                    aria-hidden="true"
                    className={icon == FaUserFriends ? "mb-[-6px]" : ""}
                />
            </div>
            <div className="flex flex-row mb-2">
                <div className="h-[20px] w-[2px] bg-gradient-to-t from-blue-800 to-theme" />
                <h1 className="font-semibold mb-1 ml-3">{title}</h1>
            </div>
            <h1 className="text-sm ml-3">{description}</h1>
        </div>
    );
}
