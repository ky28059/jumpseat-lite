import PriceGraph from "@/app/(landing)/PriceGraph";
import Section, { SectionHeading, SectionText } from "@/app/(landing)/Section";
import ViewMoreButton from "@/components/ViewMoreButton";


export default function AutopilotSection() {
    return (
        <Section>
            <SectionText>
                <SectionHeading>
                    {/*Meet <span className="text-theme">autopilot</span>.*/}
                    27.7 Chipotle bowls a year (with guac).
                </SectionHeading>
                <p className="mb-3">
                    That’s what you could get with the money you’d save if you bought all of your flights at their
                    cheapest, but nobody has the time to track prices on every break.
                </p>
                <p className="mb-6">
                    Autopilot is our solution to this problem. Find out more at the link below.
                </p>
                <ViewMoreButton href="/autopilot">Learn about Autopilot</ViewMoreButton>
            </SectionText>

            <PriceGraph />
        </Section>
    );
}
