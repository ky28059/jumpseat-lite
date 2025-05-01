'use client'

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Session } from 'next-auth';

// Components
import ThemeToggle from '@/components/ThemeToggle';
import SignInButton from '@/app/SignInButton';
import SignOutButton from '@/app/SignOutButton';
import NavBarMobileMenu from '@/app/NavBarMobileMenu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
} from '@/components/ui/navigation-menu';

// Utils
import type { SchoolConfig } from '@/lib/schools';
import { useScroll } from '@/hooks/useScroll';


type NavBarProps = {
    session: Session | null,
    config?: SchoolConfig
}
export default function NavBar(props: NavBarProps) {
    const scroll = useScroll();

    return (
        <header className={'px-6 sm:px-12 py-3 fixed top-0 z-40 w-full flex items-center transition duration-200 ' + (scroll > 0 ? 'bg-background/40 backdrop-blur-md border-b border-tertiary/50' : 'hover:bg-background/40 hover:backdrop-blur-md hover:border-b hover:border-tertiary/50')}>
            <Link href="/" className="font-bold text-lg mr-6 flex gap-3 items-center text-theme">
                {/*<img*/}
                {/*    src="/icon.png"*/}
                {/*    alt="Jumpseat logo"*/}
                {/*    className="w-8 rounded"*/}
                {/*/>*/}
                Jumpseat

                {props.config && (
                    <span className="border-l border-secondary text-primary pl-3 font-semibold text-base">
                        {props.config.name}
                    </span>
                )}
            </Link>

            <NavLink href="/search">
                Search
            </NavLink>

            {/*
            <NavLink href="/social">
                Social
            </NavLink>
            */}

            <NavigationMenu className="hidden lg:block">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-secondary hover:text-primary font-semibold py-2 px-2.5 bg-transparent">
                            About
                        </NavigationMenuTrigger>

                        <NavigationMenuContent className="bg-background border-tertiary !w-40 flex flex-col px-1.5 pt-1.5 pb-2">
                            <NavDropdownLink href="/about">
                                About us
                            </NavDropdownLink>

                            {/*
                            <NavDropdownLink href="/blog">
                                Blog
                            </NavDropdownLink>
                            */}

                            <a
                                // TODO
                                className="py-1.5 px-3 mr-[2px] text-secondary hover:text-primary hover:bg-tertiary/40 rounded transition duration-200 text-sm"
                                href="https://portal.jumpseatapp.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Portal
                            </a>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-auto flex">
                <ThemeToggle className="hidden lg:block p-2.5 mx-2" />
                {!props.session ? (
                    <SignInButton config={props.config} />
                ) : (
                    <SignOutButton session={props.session} />
                )}

                <NavBarMobileMenu />
            </div>
        </header>
    )
}

type NavLinkProps = {
    href: string,
    children: ReactNode
}
function NavLink(props: NavLinkProps) {
    return (
        <Link
            className="hidden lg:block py-2 px-2.5 text-secondary hover:text-primary transition duration-200 text-sm font-semibold"
            href={props.href}
        >
            {props.children}
        </Link>
    )
}

function NavDropdownLink(props: NavLinkProps) {
    return (
        <Link
            className="py-1.5 px-3 mr-[2px] text-secondary hover:text-primary hover:bg-tertiary/40 rounded transition duration-200 text-sm"
            href={props.href}
        >
            {props.children}
        </Link>
    )
}
