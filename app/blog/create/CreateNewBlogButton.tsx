'use client'

import { useState } from 'react';

// Components
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import EditBlogModal from '@/app/blog/create/EditBlogModal';


export default function CreateNewBlogButton(props: { authorId: number }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="border-[1.5px] rounded border-tertiary border-dashed text-secondary py-12 hover:bg-content-secondary transition duration-200">
                Create new blog post
            </DialogTrigger>

            <EditBlogModal
                title="Create new blog post"
                setOpen={setOpen}
                authorId={props.authorId}
            />
        </Dialog>
    )
}
