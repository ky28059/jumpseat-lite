import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// Components
import CreateNewBlogButton from '@/app/blog/create/CreateNewBlogButton';
import EditBlogPost from '@/app/blog/create/EditBlogPost';

// Utils
import { auth } from '@/auth';
import prisma from '@/lib/db/prisma';


export const metadata: Metadata = {
    title: 'Create a blog'
}

export default async function Create() {
    // Redirect if user is not logged in or not admin
    const session = await auth();
    if (!session?.user.isAdmin) redirect('/');

    // Fetch and render all blogs
    const posts = await prisma.blogPost.findMany({
        orderBy: [{ createdAt: 'desc' }]
    });

    const authorId = Number(session.user.id);

    return (
        <div className="container pt-28 pb-16">
            <h1 className="font-semibold text-2xl mb-14">
                Create or edit a blog post
            </h1>

            <div className="flex flex-col gap-10">
                <CreateNewBlogButton authorId={authorId} />

                {posts.map((p) => (
                    <EditBlogPost
                        post={p}
                        authorId={authorId}
                        key={p.id}
                    />
                ))}
            </div>
        </div>
    )
}
