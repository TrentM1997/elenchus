import { lazy } from "react";
const ArticleLink = lazy(
  () =>
    import("../features/investigate/phase2/results/components/links/ArticleLink"),
);
import { Suspense } from "react";
import LinkPlaceholder from "../features/investigate/phase2/search/components/loaders/LinkPlaceholder";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import type { RootState } from "@/state/store";
import { useSelector } from "react-redux";

import { SearchResultsState } from "@/state/Reducers/Investigate/articles/SearchResults";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";

type RenderSearchResultsProps = {
  state: SearchResultsState;
  urlHash: Set<string>;
  select: (article: SelectedArticle) => () => void;
  selected: SelectedArticles;
};

export default function RenderSearchResults({
  state,
  urlHash,
  select,
  selected,
}: RenderSearchResultsProps) {
  const currentPage = useSelector(
    (s: RootState) => s.investigation.search.currentPage,
  );

  switch (state.status) {
    case "initial": {
    }
    case "pending": {
    }
    case "failed": {
    }
    case "empty": {
      return;
    }
    case "ready": {
      const page = state.data[currentPage];

      return (
        <>
          {Array.isArray(page) &&
            page.length > 0 &&
            page.map((article: SelectedArticle, index: number) => (
              <Suspense
                key={article.url}
                fallback={
                  <DelayedFallback>
                    <LinkPlaceholder />
                  </DelayedFallback>
                }
              >
                <ArticleLink
                  highlight={urlHash.has(article.url)}
                  inModal={false}
                  mute={selected.status === "max"}
                  chooseArticle={select}
                  isPriority={index <= 8}
                  article={article}
                />
              </Suspense>
            ))}
        </>
      );
    }
  }
}
