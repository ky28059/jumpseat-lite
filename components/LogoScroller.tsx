const logos = [
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/AS.svg",
        alt: "Alaska Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/AF.svg",
        alt: "Air France Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/VS.svg",
        alt: "Virgin Atlantic Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/UA.svg",
        alt: "United Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/AA.svg",
        alt: "American Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/NK.svg",
        alt: "Spirit Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/EK.svg",
        alt: "Emirates Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/B6.svg",
        alt: "Jet Blue Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/LH.svg",
        alt: "Lufthansa Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/BA.svg",
        alt: "British Airways Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/EY.svg",
        alt: "Etihad Airways Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/HA.svg",
        alt: "Hawaiian Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/QR.svg",
        alt: "Qatar Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/LX.svg",
        alt: "Swiss Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/TK.svg",
        alt: "Turkish Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/AC.svg",
        alt: "Air Canada Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/EI.svg",
        alt: "Air Lingus Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/CA.svg",
        alt: "Air China Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/A3.svg",
        alt: "Aegean Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/OS.svg",
        alt: "Austrian Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/AV.svg",
        alt: "Avianca Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/SN.svg",
        alt: "Brussels Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/CM.svg",
        alt: "Copa Airlines Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/U2.svg",
        alt: "EasyJet Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/4Y.svg",
        alt: "Eurowings Discover Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/IB.svg",
        alt: "Iberia Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/I2.svg",
        alt: "Iberia Express Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/JQ.svg",
        alt: "Jetstar Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/KL.svg",
        alt: "KLM Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/LV.svg",
        alt: "Level Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/OA.svg",
        alt: "Olympic Air Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/QF.svg",
        alt: "Qantas Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/SK.svg",
        alt: "Scandinavian Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/TR.svg",
        alt: "Scoot Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/SQ.svg",
        alt: "Singapore Airlines",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/TO.svg",
        alt: "Transavia Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/Y4.svg",
        alt: "Volaris Logo",
    },
    {
        src: "https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/VY.svg",
        alt: "Vueling Airlines Logo",
    },
];

export default function LogoScroller() {
    return (
        <div className="py-12 sm:py-16 flex space-x-16 overflow-hidden">
            <div className="flex animate-loop-scroll group-hover:paused xs:space-x-24 space-x-16 w-fit">
                {logos.map((logo) => (
                    <img
                        key={logo.src}
                        loading="lazy"
                        src={logo.src}
                        className="max-h-6 dark:invert dark:hue-rotate-180"
                        alt={logo.alt}
                    />
                ))}
            </div>
            <div
                className="flex animate-loop-scroll group-hover:paused xs:space-x-24 space-x-16 pl-[4370px]"
                aria-hidden
            >
                {logos.map((logo) => (
                    <img
                        key={logo.src}
                        loading="lazy"
                        src={logo.src}
                        className="max-h-6 dark:invert dark:hue-rotate-180"
                        alt={logo.alt}
                    />
                ))}
            </div>
        </div>
    );
}
