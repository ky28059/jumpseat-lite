import Section, { SectionHeading, SectionText } from "@/app/(landing)/Section";
import ViewMoreButton from "@/components/ViewMoreButton";


export default function SearchSection() {
    return (
        <Section>
            <div className="w-full lg:max-w-lg xl:max-w-2xl flex flex-none items-center justify-center text-secondary border border-tertiary rounded-lg shadow-xl overflow-clip">
                <video
                    src="/assets/search_video.mp4"
                    width={1052}
                    height={720}
                    loop
                    autoPlay
                    muted
                    playsInline
                    disablePictureInPicture
                />
            </div>

            <SectionText>
                <SectionHeading>
                    Never waste time in the airport again.
                </SectionHeading>
                <p className="mb-6">
                    Every break, students spend hours in the airport waiting for either their flight or shuttle. Get the
                    best combination of both so you waste as little time as possible when traveling.
                </p>

                {/*
                <div className="flex gap-3 p-5 rounded shadow-lg bg-content mb-4 border border-tertiary">
                    <p className="text-xl font-bold text-secondary w-10 text-right">1.</p>
                    <div>
                        <h3 className="font-semibold text-lg mb-2">
                            Combos = flights + shuttles
                        </h3>
                        <p className="text-sm">
                            This mode checks out all the shuttle options from campus to nearby airports and pairs them
                            with flights to your home airport so you don't sit in the airport all day.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 p-5 rounded shadow-lg bg-content mb-4 border border-tertiary">
                    <p className="text-xl font-bold text-secondary w-10 text-right">2.</p>
                    <div>
                        <h3 className="font-semibold text-lg mb-2">
                            Snipe the best deals
                        </h3>
                        <p className="text-sm mb-2">
                            Sniper (beta) predicts when flight prices will drop and lets you pay that future price
                            right now— even if the price goes up instead. We take the risk and cover the difference.
                        </p>
                        <p className="text-sm">
                            <Link href="/autopilot" className="text-theme hover:underline">
                                Request access now.
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-secondary italic mb-6">
                    TLDR: if you’re an OOS college student, this will work better for you than Google Flights, Kayak,
                    or Expedia.
                </p>
                */}

                <ViewMoreButton href="/search">
                    Make a search
                </ViewMoreButton>
            </SectionText>
        </Section>
    );
}
