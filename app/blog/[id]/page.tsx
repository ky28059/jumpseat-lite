import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate } from 'date-fns';

// Components
import BlogPostContent from '@/app/blog/BlogPostContent';

// Utils
import prisma from '@/lib/db/prisma';


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const post = await prisma.blogPost.findUnique({ where: { id: params.id } });

    if (!post) return notFound();

    return {
        title: post.title,
    }
}

export default async function BlogPage({ params }: { params: { id: string } }) {
    const post = await prisma.blogPost.findUnique({
        where: { id: params.id },
        include: { author: true }
    });

    if (!post) return;

    return (
        <div className="container pt-28 pb-20">
            <header className="flex gap-2 items-center mb-6">
                <Link
                    className="text-theme font-semibold"
                    href="/blog"
                >
                    Blog
                </Link>
                <span className="text-tertiary text-lg select-none">/</span>
                <Link
                    className="text-theme font-semibold"
                    href={`/blog?topic=${post.category}`}
                >
                    {post.category}
                </Link>
            </header>

            <div className="flex gap-16">
                <aside className="w-72 flex-none pt-20 h-max sticky top-20">
                    <div className="flex gap-4 items-center mb-5">
                        <img
                            className="size-14 rounded-full object-cover object-center"
                            src="https://thispersondoesnotexist.com/"
                        />
                        <div>
                            <p className="font-semibold">
                                {post.author?.firstName} {post.author?.lastName}
                            </p>
                            <p className="text-secondary text-sm">
                                Portal, Product Manager
                            </p>
                        </div>
                    </div>
                </aside>

                <div>
                    <h1 className="font-bold tracking-tight text-6xl mb-8">
                        {post.title}
                    </h1>

                    <p className="border-l border-tertiary pl-4 -ml-4 mb-10 text-secondary text-sm">
                        {formatDate(post.createdAt, 'MMMM dd, yyyy')}
                    </p>

                    <img
                        className="rounded w-full h-96 object-cover object-center shadow-xl mb-16"
                        src={post.image}
                    />

                    <BlogPostContent>
                        {post.content}
                    </BlogPostContent>
                </div>
            </div>
        </div>
    )
}
