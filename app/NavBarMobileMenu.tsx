import { ReactNode, useState } from 'react';
import Link from 'next/link';

// Components
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Icons
import { BiMenu, BiX } from 'react-icons/bi';


export default function NavBarMobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open}>
            <PopoverTrigger className="ml-2.5 lg:hidden group" onClick={() => setOpen(!open)}>
                <BiMenu className="text-xl group-data-[state=open]:hidden" />
                <BiX className="text-xl hidden group-data-[state=open]:block" />
            </PopoverTrigger>
            <PopoverContent
                sideOffset={13} // py-3 = 0.75rem = 12px, + 1px border
                className="rounded-none lg:hidden px-3 sm:px-9 border-none w-screen h-[calc(100vh_-_57px)] flex flex-col data-[state=closed]:!zoom-out-100 data-[state=open]:!zoom-in-100 slide-in-from-top-screen"
            >
                <NavBarMenuLink href="/search" setOpen={setOpen}>
                    Search
                </NavBarMenuLink>

                {/*
                <NavBarMenuLink href="/social">
                    Social
                </NavBarMenuLink>
                */}

                <NavBarMenuLink href="/about" setOpen={setOpen}>
                    About
                </NavBarMenuLink>

                {/* <NavBarMenuLink href="/blog" setOpen={setOpen}>
                    Blog
                </NavBarMenuLink> */}

                <a
                    // TODO
                    className="py-2 px-2.5 text-lg text-secondary hover:text-primary transition duration-200 font-semibold"
                    href="https://portal.jumpseatapp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Portal
                </a>
            </PopoverContent>
        </Popover>
    )
}

type NavBarMenuLinkProps = {
    href: string,
    children: ReactNode,
    setOpen: (open: boolean) => void
}
function NavBarMenuLink(props: NavBarMenuLinkProps) {
    return (
        <Link
            className="py-2 px-3 text-lg text-secondary hover:text-primary transition duration-200 font-semibold"
            href={props.href}
            onClick={() => setTimeout(() => props.setOpen(false), 150)}
        >
            {props.children}
        </Link>
    )
}
