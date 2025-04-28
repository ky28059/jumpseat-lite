import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';
import tailwindAnimatePlugin from "tailwindcss-animate";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "1rem",
                lg: "2rem",
                xl: "4rem",
                "2xl": "10rem",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                foreground: "hsl(var(--foreground))",

                // Text colors
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: "hsl(var(--secondary))",
                tertiary: "hsl(var(--tertiary))",

                // Background colors
                background: "hsl(var(--background))",
                content: "hsl(var(--content))",
                "content-secondary": {
                    DEFAULT: "hsl(var(--content-secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },

                theme: {
                    DEFAULT: "hsl(var(--theme))",
                },

                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                grayinput: {
                    DEFAULT: "hsl(var(--gray-input))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "loop-scroll": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-6800px)" },
                },
                pulseBlue: {
                    '0%, 100%': { opacity: '1', color: "#3b82f6" },
                    '50%': { opacity: '0.5', color: "#3b82f6" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "loop-scroll": "loop-scroll 150s linear infinite",
                'pulse-blue': 'pulseBlue .8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            boxShadow: {
                "inset-left": "inset -10px 0 5px -5px #ffffff",
                "inset-right": "inset 10px 0 5px -5px #ffffff",
                "inset-both": "inset -10px 0 5px -5px #ffffff, inset 10px 0 5px -5px #ffffff",
                "inset-left-dark": "inset -10px 0 5px -5px #141414",
                "inset-right-dark": "inset 10px 0 5px -5px #141414",
                "inset-both-dark": "inset -10px 0 5px -5px #141414, inset 10px 0 5px -5px #141414",
            },
        },
    },
    plugins: [
        tailwindAnimatePlugin,
        plugin(({ addVariant }) => {
            addVariant('scrollbar', ['&::-webkit-scrollbar']);
            addVariant('scrollbar-thumb', ['&::-webkit-scrollbar-thumb']);
        })
    ],
};

export default config;
