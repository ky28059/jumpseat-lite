import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

// Utils
import { signOutAction } from '@/lib/auth';

// Icons
import { FaUserCircle } from 'react-icons/fa';


type SignOutButtonProps = {
    session: Session
}
export default function SignOutButton(props: SignOutButtonProps) {
    const router = useRouter();

    async function viewAccount() {
        // await signOutAction();
        router.push('/account');
    }

    const user = props.session.user?.email?.split("@")[0];

    return (
        <button
            className="px-4 py-1.5 rounded-full bg-black text-white font-medium text-sm flex gap-2 items-center"
            onClick={viewAccount}
        >
            <FaUserCircle />
            
            <p className="md:hidden block">{user && user.length > 11 ? user?.slice(0, 8) + "..." : user}</p>
            <p className="md:block hidden">{user}</p>
        </button>
    )
}
