import type { Metadata } from 'next';
import Link from 'next/link';

// Components
import BlogContent from '@/app/blog/BlogContent';

// Utils
import type { BlogCategory } from '@/generated/prisma/browser';
import type { BlogPostWithUser } from '@/lib/db/blog';
import prisma from '@/lib/db/prisma';
import { auth } from '@/auth';


export const metadata: Metadata = {
    title: 'Blog'
}

export default async function Blog({ searchParams }: { searchParams: Promise<{ topic?: BlogCategory }> }) {
    const params = await searchParams;

    // Fetch and render all blogs
    const posts = await prisma.blogPost.findMany({
        orderBy: [{ createdAt: 'desc' }],
        include: { author: true }
    }) as BlogPostWithUser[]; // https://github.com/prisma/prisma/issues/28970

    // Display link to create blog page if user is logged in and admin
    const session = await auth();

    return (
        <div className="container pt-28 pb-20">
            {session?.user.isAdmin && (
                <div className="relative">
                    <Link href="/blog/create" className="text-secondary hover:underline absolute top-0 right-0">
                        Create a blog (admin) {'->'}
                    </Link>
                </div>
            )}

            <h1 className="font-semibold text-2xl mb-6">
                Blog
            </h1>

            <BlogContent
                posts={posts}
                initialCategory={params.topic}
            />
        </div>
    )
}
