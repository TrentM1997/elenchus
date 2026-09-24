import type { JSX } from "react";
import type { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import type { BrowsingOptionSchemaType } from "@elenchus/contracts/schemas/articles/BrowsingOptionSchema";
import { Fragment, lazy } from "react";
import { Suspense } from "react";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import LinkPlaceholder from "../../search/components/loaders/LinkPlaceholder";
const ArticleLink = lazy(
  () =>
    import("@/components/React/features/investigate/phase2/results/components/links/ArticleLink"),
);

interface PageProps {
  page: BrowsingOptionSchemaType[];
  urlHash: Set<string>;
  select: (article: BrowsingOptionSchemaType) => () => void;
  selected: SelectedArticles;
}

export default function Page({
  page,
  select,
  urlHash,
  selected,
}: PageProps): JSX.Element {
  return (
    <Fragment>
      {page.map((article, index: number) => (
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
    </Fragment>
  );
}
