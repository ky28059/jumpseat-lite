"use client"

import { useRouter } from 'next/navigation';
import { signOutAction } from '@/lib/auth';


export default function AccountSignOutButton() {
    const router = useRouter();
    const signOut = async () => {
        await signOutAction();
        router.push("/")
    }

    return (
        <button
            className="px-4 py-2 rounded-md bg-red-500 font-medium text-white"
            onClick={signOut}
        >
            Sign out
        </button>
    )
}
