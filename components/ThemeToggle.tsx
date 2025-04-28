'use client'

import { BiSun } from 'react-icons/bi';
import { THEME_COOKIE_NAME } from '@/lib/config';


export default function ThemeToggle(props: { className?: string }) {
    function toggleTheme() {
        const dark = document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark');
        document.cookie = `${THEME_COOKIE_NAME}=${dark ? 'light' : 'dark'};`;

        const themeChangeEvent = new Event('themeChange');
        window.dispatchEvent(themeChangeEvent);
    }

    return (
        <button onClick={toggleTheme} className={props.className}>
            <BiSun />
        </button>
    )
}
