'use server'

import prisma from '@/lib/db/prisma';
import { auth } from '@/auth';
import type { Prisma } from '@prisma/client';


export type BlogPostWithUser = Prisma.BlogPostGetPayload<{
    include: { author: true }
}>

/**
 * Creates or updates a blog post in the database with the given data.
 * @param data The blog data to create or update.
 */
export async function upsertBlog(data: Parameters<typeof prisma.blogPost.create>[0]["data"]) {
    // Prevent non-admins from editing blogs.
    const session = await auth();
    if (!session?.user.isAdmin) return { error: 'Unauthorized' };

    const post = await prisma.blogPost.upsert({
        create: data,
        update: data,
        where: {
            id: data.id
        }
    })
    console.log(post);

    return { ok: true };
}

/**
 * Deletes a blog post in the database with the given ID.
 * @param id The post id to delete.
 */
export async function deleteBlog(id: string) {
    // Prevent non-admins from deleting blogs.
    const session = await auth();
    if (!session?.user.isAdmin) return { error: 'Unauthorized' };

    await prisma.blogPost.delete({
        where: { id }
    });

    return { ok: true };
}
