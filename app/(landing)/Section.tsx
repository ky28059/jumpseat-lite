import type { ReactNode } from "react";


export default function Section(props: { children: ReactNode }) {
    return (
        <section className="py-12 container flex flex-col lg:flex-row gap-x-12 xl:gap-x-20 gap-y-12">
            {props.children}
        </section>
    );
}

export function SectionHeading(props: { children: ReactNode }) {
    return (
        <h2 className="text-4xl sm:text-5xl font-semibold mb-8 text-pretty">
            {props.children}
        </h2>
    );
}

export function SectionText(props: { children: ReactNode }) {
    return (
        <div className="lg:py-12">
            {props.children}
        </div>
    );
}
