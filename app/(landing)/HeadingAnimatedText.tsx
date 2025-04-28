"use client";

import { ReactNode, useEffect, useState } from "react";


type HeadingAnimatedTextProps = {
    delay: number, // ms to wait before animating in
    visible: number, // ms to wait before animating out
    children: ReactNode,
    skipAnimateOut?: boolean,
};
export default function HeadingAnimatedText(props: HeadingAnimatedTextProps) {
    const [animateClassName, setAnimateClassName] = useState("invisible");

    // Implement transitions using `tailwindcss-animate` (without `headlessui`)
    useEffect(() => {
        setTimeout(() => setAnimateClassName("animate-in fade-in slide-in-from-top"), props.delay);
        if (props.skipAnimateOut) return;

        setTimeout(() => setAnimateClassName("animate-out fade-out slide-out-to-bottom"), props.delay + props.visible);
        setTimeout(() => setAnimateClassName("invisible"), props.delay + props.visible + 150);
    }, []);

    return (
        <span className={`absolute left-0 bg-gradient-to-r from-theme to-sky-500 bg-clip-text text-transparent pb-4 w-max ${animateClassName}`}>
            {props.children}
        </span>
    );
}
