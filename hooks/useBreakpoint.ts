import { useMediaQuery } from "react-responsive";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";


const fullConfig = resolveConfig(tailwindConfig);
const breakpoints = fullConfig.theme.screens;

/**
 * Returns whether you are at or above the given tailwind breakpoint. Modified from
 * {@link https://stackoverflow.com/a/76630444}.
 * @param key The breakpoint to check (e.g. "sm", "md", etc.).
 * @returns Whether you are at or above that breakpoint (i.e. whether a conditional class of that breakpoint would
 * apply).
 */
export function useBreakpoint<K extends keyof typeof breakpoints>(key: K) {
    return useMediaQuery({
        query: `(min-width: ${breakpoints[key]})`,
    });
}
