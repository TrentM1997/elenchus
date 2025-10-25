import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function ArticleBody({ markdown }: { markdown: string }): JSX.Element | null {

    return (
        <article className="prose prose-invert max-w-[80ch] leading-7 text-zinc-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
            </ReactMarkdown>
        </article>
    );
}