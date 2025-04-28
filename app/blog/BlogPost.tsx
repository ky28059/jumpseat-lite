import Link from 'next/link';
import { formatDate } from 'date-fns';
import type { BlogPostWithUser } from '@/lib/db/blog';


export default function BlogPost(props: BlogPostWithUser) {
    const blogHref = `/blog/${props.id}`;

    return (
        <div className="flex flex-col md:flex-row gap-x-16 gap-y-8">
            <img
                className="rounded flex-none w-full md:w-80 lg:w-[26rem] h-72 object-cover object-center shadow-xl"
                src={props.image}
                alt={props.title}
            />

            <div className="flex flex-col">
                <div className="flex gap-2 items-center mb-6">
                    <span className="text-theme bg-theme/30 rounded-full px-2 py-0.5 text-xs font-semibold w-max">
                        {props.category}
                    </span>
                    <span className="text-tertiary text-lg select-none">/</span>
                    <span className="text-secondary text-sm">
                        {formatDate(props.createdAt, 'MMMM dd, yyyy')}
                    </span>
                </div>

                <Link
                    className="font-bold tracking-tight text-3xl mb-4"
                    href={blogHref}
                >
                    {props.title}
                </Link>

                <div className="flex gap-4 items-center mb-5">
                    <img
                        className="size-14 rounded-full object-cover object-center"
                        src="https://thispersondoesnotexist.com/" // TODO
                    />
                    <div>
                        <p className="font-semibold">
                            {props.author?.firstName} {props.author?.lastName}
                        </p>
                        <p className="text-secondary text-sm">
                            Portal, Product Manager
                        </p>
                    </div>
                </div>

                <p className="text-secondary text-pretty mb-4">
                    {props.preview}
                </p>

                <Link
                    className="text-theme font-semibold"
                    href={blogHref}
                >
                    Read more →
                </Link>
            </div>
        </div>
    )
}
