import type { JSX } from "react";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import ArticleLink from "../features/investigate/phase2/results/components/links/ArticleLink";
import { BrowsingOptionSchemaType } from "@elenchus/contracts/schemas/articles/BrowsingOptionSchema";

type RenderSelectedArticlesProps = {
  state: SelectedArticles;
  onScrollHandler: (event: any) => void;
  chooseArticle?: (article: BrowsingOptionSchemaType) => () => void;
};

export default function RenderSelectedArticles({
  state,
  chooseArticle,
  onScrollHandler,
}: RenderSelectedArticlesProps): JSX.Element | null {
  switch (state.status) {
    case "partial":
    case "max": {
      return (
        <ul
          aria-label="Chosen articles displayed"
          onScroll={onScrollHandler}
          className="py-2 mx-auto gap-y-2 
             w-full h-full relative overflow-y-auto no-scrollbar z-40  
              sm:flex-row sm:flex-wrap flex flex-col items-center 
              justify-start sm:justify-center sm:gap-x-3"
        >
          {state.data.map((article, index) => (
            <ArticleLink
              key={article.url}
              chooseArticle={chooseArticle}
              inModal={true}
              article={article}
            />
          ))}
        </ul>
      );
    }

    default: {
      return null;
    }
  }
}
