import ShuttleMap from '@/app/(landing)/ShuttleMap';
import Section, { SectionHeading, SectionText } from '@/app/(landing)/Section';
import ViewMoreButton from '@/components/ViewMoreButton';


export default function ShuttleSection() {
    return (
        <Section>
            <ShuttleMap />

            <SectionText>
                <SectionHeading>
                    Shuttle smarter, not harder.
                </SectionHeading>
                <p className="dark:text-primary-dark mb-6">
                    Discover "Portal," our integrated shuttle booking feature that simplifies your travel logistics.
                    Portal seamlessly integrates into Jumpseat to make booking a shuttle as easy as a single click.
                </p>
                {/*<div className="flex gap-6">*/}
                {/*    <ShuttlePartner src="/assets/shuttle-logos/lafayette-limo.png" />*/}
                {/*    <ShuttlePartner src="/assets/shuttle-logos/RS.svg" className="invert dark:invert-0" />*/}
                {/*</div>*/}
                <ViewMoreButton href="...">
                    Lafayette Limo
                </ViewMoreButton>
            </SectionText>
        </Section>
    )
}

type ShuttlePartnerProps = {
    src: string,
    className?: string
}
function ShuttlePartner(props: ShuttlePartnerProps) {
    return (
        <img
            src={props.src}
            className={'max-h-14' + (props.className ? ` ${props.className}` : '')}
        />
    )
}
