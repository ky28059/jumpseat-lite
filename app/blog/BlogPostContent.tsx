import Markdown from 'react-markdown';


export default function BlogPostContent(props: { children: string }) {
    return (
        <Markdown className="wrap-break-word space-y-8 [&_a]:text-theme [&_a:hover]:underline">
            {props.children}
        </Markdown>
    )
}
