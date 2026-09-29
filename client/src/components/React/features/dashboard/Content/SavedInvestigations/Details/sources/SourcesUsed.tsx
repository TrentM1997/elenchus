import NoSourcesFound from "./fallbacks/NoSourcesFound";
import ResearchSource from "./ResearchSource";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export function SourcesFromResearch({
  sources,
}: {
  sources: ArticleSchemaType[];
}) {
  return (
    <div className="w-full relative lg:max-w-5xl xl:max-w-5xl 2xl:max-w-7xl h-auto mx-auto">
      <div className="w-full relative flex items-center h-fit px-4 justify-start">
        <p className="text-blue-400">Sources used</p>
      </div>
      <ol
        role="list"
        className="grid gap-12 mt-24 w-full md:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto lg:px-0 xl:px-0 md:px-12 px-8"
      >
        <Sources articles={sources} />
      </ol>
    </div>
  );
}

function Sources({ articles }: { articles: ArticleSchemaType[] }) {
  if (articles.length === 0) return <NoSourcesFound />;

  return articles.map((article) => (
    <ResearchSource key={article.id} article={article} />
  ));
}
