import Heading from "@/app/(landing)/Heading";
import SearchSection from "@/app/(landing)/SearchSection";
import AutopilotSection from "@/app/(landing)/AutopilotSection";
import LetterSection from "@/app/(landing)/LetterSection";
import LogoScroller from '@/components/LogoScroller';


export default function Home() {
    return (
        <>
            <Heading />

            <div className="py-16 md:py-20 bg-background">
                <SearchSection />
                <AutopilotSection />
                {/* <ShuttleSection /> */}

                <LogoScroller />
                <LetterSection />
            </div>
        </>
    );
}
