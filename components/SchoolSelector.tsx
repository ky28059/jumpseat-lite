"use client";

import { usePathname, useRouter } from "next/navigation";

// Components
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";

// Utils
import { schoolToConfig, schoolConfigs } from "@/lib/schools";
import { cn } from "@/lib/utils";
import { SCHOOL_COOKIE_NAME } from '@/lib/config';


type SchoolSelectorProps = {
    school: string | undefined,
    className?: string,
    placeholder: string,
};
export default function SchoolSelector(props: SchoolSelectorProps) {
    const config = schoolToConfig(props.school);
    const router = useRouter();

    return (
        <Select
            defaultValue={props.school ?? 'purdue'}
            onValueChange={(h) => {
                document.cookie = `${SCHOOL_COOKIE_NAME}=${h}`;
                router.refresh();
            }}
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
                    {Object.entries(schoolConfigs).map(([id, c]) => (
                        <SelectItem value={id} key={id}>
                            {c.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
