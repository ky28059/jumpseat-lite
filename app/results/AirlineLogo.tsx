import Image from 'next/image';


type AirlineLogoProps = {
    className?: string,
    name: string
}
export default function AirlineLogo(props: AirlineLogoProps) {
    const code = airlineCodeMap[props.name];
    if (!code) return (
        <div className={props.className}>
            <div className="bg-content-secondary size-full flex items-center justify-center font-semibold text-secondary">
                {props.name[0].toUpperCase()}
            </div>
        </div>
    )

    return (
        <img
            loading="lazy"
            src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${code}.svg`}
            className={props.className}
            alt="airline logo"
        />
    )
}

const airlineCodeMap: { [name: string]: string } = {
    "United": "UA",
    "American": "AA",
    "Alaska": "AS",
    "Sun Country Airlines": "SY",
    "Delta": "DL",
    "JetBlue": "B6",
    "Southwest": "WN",
    "Lufthansa": "LH",
    "Frontier": "F9",
    "Spirit": "NK"
}
