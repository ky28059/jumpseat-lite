'use client'

import { useState } from 'react';
import type { BlogPost } from '@prisma/client';

// Components
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import EditBlogModal from '@/app/blog/create/EditBlogModal';


type EditBlogPostProps = {
    post: BlogPost,
    authorId: number
}
export default function EditBlogPost(props: EditBlogPostProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex flex-col md:flex-row gap-x-16 gap-y-8 border border-tertiary rounded p-6 hover:bg-content-secondary text-left transition duration-200">
                <img
                    className="rounded flex-none w-full md:w-80 object-cover object-center shadow-xl"
                    src={props.post.image}
                    alt={props.post.title}
                />

                <div className="flex flex-col">
                    <div className="flex gap-2 items-center mb-6">
                    <span className="text-theme bg-theme/30 rounded-full px-2 py-0.5 text-xs font-semibold w-max">
                        {props.post.category}
                    </span>
                        <span className="text-tertiary text-lg select-none">/</span>
                        <span className="text-secondary text-sm">
                        May 6, 2024
                    </span>
                    </div>

                    <h1 className="font-bold tracking-tight text-3xl mb-4">
                        {props.post.title}
                    </h1>

                    <p className="text-secondary text-pretty">
                        {props.post.preview}
                    </p>
                </div>
            </DialogTrigger>

            <EditBlogModal
                title="Edit blog post"
                post={props.post}
                setOpen={setOpen}
                authorId={props.authorId}
            />
        </Dialog>
    )
}
