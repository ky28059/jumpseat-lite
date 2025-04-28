'use client'

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogCategory, BlogPost } from '@prisma/client';

// Components
import BlogPostContent from '@/app/blog/BlogPostContent';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Utils
import { deleteBlog, upsertBlog } from '@/lib/db/blog';


type EditBlogModalProps = {
    title: string,
    post?: BlogPost,
    setOpen: (o: boolean) => void,
    authorId: number
}
export default function EditBlogModal(props: EditBlogModalProps) {
    const [id, setId] = useState(props.post?.id ?? '');
    const [title, setTitle] = useState(props.post?.title ?? '');
    const [image, setImage] = useState(props.post?.image ?? '');
    const [category, setCategory] = useState(props.post?.category ?? BlogCategory.Travel)
    const [preview, setPreview] = useState(props.post?.preview ?? '');
    const [content, setContent] = useState(props.post?.content ?? '');

    const router = useRouter();

    async function upsert(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await upsertBlog({
            id, title, preview, content, image, category,
            author: { connect: { id: props.authorId } }
        });

        props.setOpen(false);
        router.refresh();
    }

    async function deletePost() {
        if (!props.post) return;
        await deleteBlog(props.post.id);

        props.setOpen(false);
        router.refresh();
    }

    return (
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogTitle>
                {props.title}
            </DialogTitle>

            <form
                className="flex flex-col min-h-0 overflow-y-auto overflow-x-visible"
                onSubmit={upsert}
            >
                <Label htmlFor="id">Post ID</Label>
                <Input
                    className="focus-visible:border-theme mb-3"
                    required
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />

                <Label htmlFor="title">Post title</Label>
                <Input
                    className="focus-visible:border-theme mb-3"
                    required
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <Label htmlFor="image">Post image link</Label>
                <Input
                    className="focus-visible:border-theme mb-5"
                    required
                    id="image"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                <Label htmlFor="category">Post category</Label>
                <Select
                    value={category}
                    onValueChange={setCategory as (v: string) => void}
                >
                    <SelectTrigger className="w-[180px] mb-4">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.values(BlogCategory).map((c) => (
                                <SelectItem value={c} key={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Label htmlFor="preview">Preview text</Label>
                <textarea
                    className="text-sm px-4 py-2.5 mb-4 rounded border border-tertiary focus:outline-none focus-visible:border-theme flex-none"
                    required
                    id="preview"
                    value={preview}
                    onChange={(e) => setPreview(e.target.value)}
                />

                <Label htmlFor="content">Post content</Label>
                <div className="flex gap-4 min-w-0 mb-4">
                    <textarea
                        className="w-1/2 text-sm flex-grow bg-content-secondary px-4 py-2.5 rounded border border-tertiary focus:outline-none focus-visible:border-theme"
                        required
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="w-1/2 flex-grow min-w-0">
                        <BlogPostContent>
                            {content}
                        </BlogPostContent>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button type="submit">
                        {props.post ? (
                            'Update post'
                        ) : (
                            'Create post'
                        )}
                    </Button>

                    {props.post && (
                        <Button type="button" variant="destructive" onClick={deletePost}>
                            Delete post
                        </Button>
                    )}
                </div>
            </form>
        </DialogContent>
    )
}
