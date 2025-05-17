import { cookies } from "next/headers";

// Components
import FlightSearchBar from "@/app/(landing)/FlightSearchBar";
import StripeGlobe from "@/app/(landing)/StripeGlobe";
import HeadingAnimatedText from "@/app/(landing)/HeadingAnimatedText";
import SchoolSelector from "@/components/SchoolSelector";

// Utils
import { airportLocationMap } from "@/lib/airports";
import { schoolToConfig, schoolConfigs } from "@/lib/schools";
import { SCHOOL_COOKIE_NAME } from '@/lib/config';


export default async function Heading() {
    const school = (await cookies()).get(SCHOOL_COOKIE_NAME)?.value;
    const config = schoolToConfig(school);

    const initialDelay = 300;
    const visible = 600;

    // The school list to animate through, in order.
    // On the main site: all supported college names -> "College"
    // On a school-specific subdomain: all *other* college names -> that college name
    const schools = Object.values(schoolConfigs)
        .map((c) => c.name)
        .filter((n) => n !== config?.name);

    return (
        <header className="relative bg-background bg-fixed bg-[linear-gradient(110deg,_var(--tw-gradient-stops))] from-55% from-transparent via-theme to-sky-500 dark:to-blue-700 md:h-screen h-[70vh] flex flex-col justify-center overflow-hidden">
            <StripeGlobe />

            <div className="relative container mx-0 select-none pointer-events-none -mt-8 sm:-mt-4">
                <SchoolSelector
                    school={school}
                    placeholder="No school selected"
                />

                <h1 className="relative flex gap-x-5 flex-wrap text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl text-primary mb-16 sm:mb-20">
                    Save time and money traveling from
                    <div className="relative">
                        {schools.map((s, i) => (
                            <HeadingAnimatedText
                                delay={initialDelay + i * visible}
                                visible={visible}
                                key={s}
                            >
                                {s}
                            </HeadingAnimatedText>
                        ))}
                        <HeadingAnimatedText
                            delay={initialDelay + schools.length * visible}
                            visible={visible}
                            skipAnimateOut
                        >
                            {config?.name ?? "College"}
                        </HeadingAnimatedText>
                    </div>
                </h1>

                <h3 className="sm:text-xl mb-6 max-w-xl flex flex-wrap text-secondary text-pretty">
                    We’re a travel platform for college students, built by college students.
                </h3>

                <FlightSearchBar airportLocs={Object.entries(airportLocationMap)} school={school} />
            </div>
        </header>
    );
}
