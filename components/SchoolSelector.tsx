"use client";

import { usePathname } from "next/navigation";

// Components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";

// Utils
import { hostToConfig, schoolConfigs } from "@/lib/schools";
import { cn } from "@/lib/utils";


type SchoolSelectorProps = {
    host: string | null,
    className?: string,
    placeholder: string,
};
export default function SchoolSelector(props: SchoolSelectorProps) {
    const config = hostToConfig(props.host);
    const pathname = usePathname();

    return (
        <Select
            value={"balls"} //props.host ?? undefined
            onValueChange={(h) => (window.location.href = `https://${h}${pathname}`)}
        >
            <SelectTrigger
                className={cn(
                    "pointer-events-auto mb-3 sm:mb-6 -ml-2 w-52 rounded-full text-sm px-4 py-2 h-max border-tertiary",
                    props.className
                )}
            >
                {config?.name ?? props.placeholder}
                {/* <SelectValue placeholder="No school selected." /> */}
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {Object.entries(schoolConfigs).map(([host, c]) => (
                        <SelectItem value={host} key={host}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

