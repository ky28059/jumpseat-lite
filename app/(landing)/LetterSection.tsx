import Section from '@/app/(landing)/Section';
import Link from 'next/link';


export default function LetterSection() {
    return (
        <Section>
            <div className="relative flex-none pr-16 pb-12">
                <div className="flex items-center justify-center p-3 rounded-xl border border-tertiary bg-white size-28 shadow-lg">
                    <img
                        src="/assets/landing/bb.webp"
                        alt="BoilerBookings logo"
                    />
                </div>

                <img
                    src="/assets/landing/jumpseat.png"
                    alt="Jumpseat logo"
                    className="absolute top-14 left-20 size-32 rounded-xl shadow-lg"
                />
            </div>

            <div>
                <h2 className="text-3xl font-semibold mb-8 text-pretty">
                    Letter from the devs
                </h2>
                <p className="mb-6">
                    Hi. We’re college students who made BoilerBookings.com to make it easier to travel home for breaks.
                    After people actually started using it, we brought on{' '}
                    <Link href="/about" className="text-theme hover:underline">nine chillers</Link>{' '}
                    to help.
                </p>
                <p className="mb-6">
                    Booking trips with shuttles is already hard enough. But then, we noticed that airlines try to
                    squeeze every dollar out of us with erratic prices.
                </p>
                <p className="mb-6">
                    As broke college students (and a bunch of CS majors) we made Jumpseat to solve these problems.
                    Hopefully, it helps you out. If not, please{' '}
                    <a href="mailto:team@jumpseatapp.com" className="text-theme hover:underline">email us</a>{' '}
                    to let us know.
                </p>
                <p className="text-secondary italic text-lg">
                    — The devs
                </p>
            </div>
        </Section>
    );
}
