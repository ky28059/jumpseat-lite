import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

// Components
import AccountContent from '@/app/account/AccountContent';
import HomeAirportSelector from '@/app/account/HomeAirportSelector';
import AccountSignOutButton from '@/app/account/AccountSignOutButton';

// Utils
import prisma from '@/lib/db/prisma';
import { auth } from '@/auth';
import { airportLocationMap } from '@/lib/airports';


export const metadata: Metadata = {
    title: 'Account'
}

export default async function AccountPage() {
    // Redirect to home if the user is not logged in
    const host = headers().get("Host");
    const session = await auth();
    if (!session?.user.id) redirect('/');

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
        include: { school: true }
    });
    if (!user) redirect('/');

    return (
        <div className="container pt-28 pb-16 lg:max-w-3xl box-content">
            <div className="flex flex-col md:flex-row justify-between gap-x-40 w-full mt-6">
                <div className="mb-6 md:mb-0 mt-2 md:mt-0">
                    <p className="text-sm font-medium">
                        Account Email
                    </p>
                    <p className="text-lg font-bold">
                        {user.email}
                    </p>
                </div>

                <HomeAirportSelector
                    airports={new Set(user.airports)}
                    airportLocs={Object.entries(airportLocationMap)}
                    schoolAirports={user.school?.airportIatas}
                    host={host}
                />
            </div>

            <AccountContent
                firstName={user.firstName ?? ""}
                lastName={user.lastName ?? ""}
                personalEmail={user.personalEmail}
                email={user.email}
            />
            <div className="mt-10 flex w-full">
                <AccountSignOutButton />
            </div>
        </div>
    );
}
