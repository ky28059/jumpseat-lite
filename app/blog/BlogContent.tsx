'use client'

import { useMemo, useState } from 'react';
import { BlogCategory } from '@prisma/client';

// Components
import BlogPost from '@/app/blog/BlogPost';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Utils
import type { BlogPostWithUser } from '@/lib/db/blog';


type BlogContentProps = {
    posts: BlogPostWithUser[],
    initialCategory?: BlogCategory
}
export default function BlogContent(props: BlogContentProps) {
    const [category, setCategory] = useState<BlogCategory | 'all'>(props.initialCategory ?? 'all');

    const postsByCategory = useMemo(() => {
        return Object.groupBy(props.posts, (p) => p.category);
    }, []);

    const filtered = category === 'all'
        ? props.posts
        : postsByCategory[category] ?? [];

    return (
        <>
            <Tabs
                value={category}
                onValueChange={setCategory as (c: string) => void}
                className="mb-16"
            >
                <TabsList className="p-0 gap-1.5">
                    <TabsTrigger
                        className="rounded-full px-4 hover:text-primary"
                        value="all"
                    >
                        All
                    </TabsTrigger>

                    {Object.values(BlogCategory).map((c) => (
                        <TabsTrigger
                            className="rounded-full px-4 hover:text-primary"
                            value={c}
                            key={c}
                            disabled={postsByCategory[c] === undefined}
                        >
                            {c}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="flex flex-col gap-16">
                {filtered.map((p) => (
                    <BlogPost
                        {...p}
                        key={p.id}
                    />
                ))}
            </div>
        </>
    )
}
