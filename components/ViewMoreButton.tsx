import type { ReactNode } from 'react';
import Link from 'next/link';

// Icons
import { FaCircleArrowRight } from 'react-icons/fa6';


type ViewMoreButtonProps = {
    href: string,
    children: ReactNode
}
export default function ViewMoreButton(props: ViewMoreButtonProps) {
    return (
        <Link
            className="flex gap-2 items-center w-max bg-black text-white rounded px-5 py-2.5 font-medium hover:bg-midnight transition duration-200"
            href={props.href}
        >
            {props.children}
            <FaCircleArrowRight />
        </Link>
    )
}
