import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Inter } from "next/font/google";

// Components
import NavBar from "@/app/NavBar";
import Footer from "@/app/Footer";

// Utils
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { SCHOOL_COOKIE_NAME, THEME_COOKIE_NAME } from "@/lib/config";
import { schoolToConfig } from "@/lib/schools";

import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | Jumpseat",
        absolute: "Jumpseat",
    },
    description: "Travel engine built for college students.",
};

export default async function RootLayout(props: { children: ReactNode }) {
    const c = await cookies();

    const theme = c.get(THEME_COOKIE_NAME)?.value;
    let session = await auth();

    const host = c.get(SCHOOL_COOKIE_NAME)?.value;
    const config = schoolToConfig(host);

    return (
        <html
            lang="en"
            className={cn("h-full", theme === "dark" && "dark")}
        >
            <head>
                {/* If we haven't initialized the theme cookie yet, inject a script to do so. */}
                {!theme && (
                    <script dangerouslySetInnerHTML={{ __html: renderInitialThemeScript }} />
                )}
            </head>
            <body style={inter.style} className="dark:text-white dark:bg-background flex flex-col h-full">
                <NavBar
                    session={session}
                    config={config}
                />
                <main className="flex-grow flex flex-col">
                    {props.children}
                </main>
                <Footer />
            </body>
        </html>
    );
}

const renderInitialThemeScript = `
function getTheme() {
    // Check the \`prefers-color-scheme\` media query for initial theme.
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const hasMediaQueryPreference = typeof mql.matches === 'boolean';
    if (hasMediaQueryPreference) {
        return mql.matches ? 'dark' : 'light';
    }
    // If they are using a browser/OS that doesn't support color theme, default to 'light'.
    return 'light';
}

const theme = getTheme();
if (theme === 'dark') document.documentElement.classList.toggle('dark');
document.cookie = \`${THEME_COOKIE_NAME}=\${theme};\`;
`;
