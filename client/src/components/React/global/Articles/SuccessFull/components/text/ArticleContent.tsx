import FullText from "./FullText";

interface ArticleContentProps {
  article_text: string;
  article_url: string;
}

export default function ArticleContent({
  article_text,
  article_url,
}: ArticleContentProps): JSX.Element | null {
  return (
    <main className={`display-block opacity-87 h-full w-full`}>
      <FullText article_text={article_text} article_url={article_url} />
    </main>
  );
}
