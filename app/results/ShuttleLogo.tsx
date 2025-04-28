import Image from 'next/image';


type ShuttleLogoProps = {
    className?: string,
    name: string,
    src: string | null
}
export default function ShuttleLogo(props: ShuttleLogoProps) {
    if (!props.src) return (
        <div className={props.className}>
            <div className="bg-content-secondary size-full flex items-center justify-center font-semibold text-secondary">
                {props.name[0].toUpperCase()}
            </div>
        </div>
    )

    return (
        <img
            loading="lazy"
            src={props.src}
            className={props.className}
            alt={`${props.name} logo`}
        />
    )
}
