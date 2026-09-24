import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ArticleBody({
  markdown,
}: {
  markdown: string;
}): JSX.Element | null {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] px-4 py-6 sm:p-6 md:p-6">
      <article
        className="prose prose-invert mx-auto w-full min-w-0 max-w-[80ch] whitespace-normal break-words leading-7 text-zinc-200
                prose-headings:font-light prose-headings:tracking-tight prose-headings:text-zinc-100
                prose-p:my-5 prose-img:my-6 prose-img:rounded-2xl
                prose-a:text-blue-300 prose-a:decoration-blue-300/40 prose-a:underline-offset-4 hover:prose-a:text-blue-200
                prose-pre:overflow-x-auto prose-pre:whitespace-pre
                [&>:first-child]:mt-0 [&>:last-child]:mb-0"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}
