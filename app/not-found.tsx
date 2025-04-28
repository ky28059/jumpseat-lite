import Link from 'next/link';
import Image from "next/image";
import NotFoundImage from "@/public/assets/404.jpg";


export default function NotFound() {
    return (
        <div className="flex-grow flex flex-col justify-center items-center mt-16 pb-10 -ml-12">
            <div className="flex flex-col items-start md:flex-row md:items-center gap-10 mx-8 py-8">
                <Image
                    src={NotFoundImage}
                    className="rounded-lg border"
                    alt="404 image"
                    width={475}
                    height={256}
                />
                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl font-bold">
                        Page not found!
                    </h1>
                    <Link
                        className="text-blue-500 font-semibold"
                        href="/"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
