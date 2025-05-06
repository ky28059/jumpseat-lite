import type { ReactNode } from 'react';
import Link from 'next/link';

// Icons
import type { IconType } from 'react-icons';
import { FaGithub } from 'react-icons/fa6';


export default function Footer() {
    return (
        <footer className="bg-content-secondary">
            <div className="container py-20 flex flex-col">
                <Link href="/" className="text-lg font-semibold mb-6 w-max">
                    Jumpseat
                </Link>

                <div className="flex flex-col sm:flex-row gap-x-20 gap-y-4 mb-8">
                    <div className="flex sm:flex-col gap-1">
                        <FooterSocialIcon
                            href="https://github.com/ky28059/jumpseat-lite"
                            icon={FaGithub}
                        />
                    </div>

                    <div className="flex flex-wrap gap-x-20 gap-y-6">
                        <div>
                            <h5 className="mb-3 font-semibold">Product</h5>
                            <ul className="flex flex-col gap-1.5 text-sm">
                                <FooterInternalLink href="/search">Search</FooterInternalLink>
                            </ul>
                        </div>

                        <div>
                            <h5 className="mb-3 font-semibold">About us</h5>
                            <ul className="flex flex-col gap-1.5 text-sm">
                                <FooterInternalLink href="/about">About</FooterInternalLink>
                                {/* <FooterInternalLink href="/blog">Blog</FooterInternalLink> */}
                            </ul>
                        </div>

                        <div>
                            <h5 className="mb-3 font-semibold">Account</h5>
                            <ul className="flex flex-col gap-1.5 text-sm">
                                <FooterInternalLink href="/account">Preferences</FooterInternalLink>
                            </ul>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-secondary">
                    © 2024 Campus Ventures, LLC
                </p>
            </div>
        </footer>
    )
}

type FooterLinkProps = {
    href: string,
    children: ReactNode
}
function FooterInternalLink(props: FooterLinkProps) {
    return (
        <li>
            <Link
                className="hover:underline"
                href={props.href}
            >
                {props.children}
            </Link>
        </li>
    )
}

function FooterExternalLink(props: FooterLinkProps) {
    return (
        <li>
            <a
                className="hover:underline"
                href={props.href}
                target="_blank"
                rel="noopener noferrer"
            >
                {props.children}
            </a>
        </li>
    )
}

type FooterSocialIconProps = {
    href: string,
    icon: IconType
}
function FooterSocialIcon(props: FooterSocialIconProps) {
    const Icon = props.icon;

    return (
        <a
            className="hover:bg-black/10 dark:hover:bg-white/10 p-3 rounded text-lg transition duration-100"
            target="_blank" // TODO: mail?
            rel="noopener noreferrer"
            href={props.href}
        >
            <Icon />
        </a>
    )
}
