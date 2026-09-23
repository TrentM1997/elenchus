import type { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";
import type { DashboardTab } from "@/state/Reducers/Dashboard/types";
import type { AppDispatch } from "@/state/store";
import { lazy, Suspense, type JSX } from "react";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import Pageskeleton from "@/components/React/routing/skeletons/PageSkeleton";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import ArticleReview from "@/components/React/features/dashboard/Content/UserArticles/containers/ArticleReview";
import { useDispatch } from "react-redux";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";
const SavedArticles = lazy(
  () =>
    import("@/components/React/features/dashboard/Content/UserArticles/containers/SavedArticles"),
);

type BookmarkedTab = Extract<
  DashboardTab,
  { kind: "articles"; display: "main" }
>;

type OpenedArticleTab = Extract<
  DashboardTab,
  { kind: "articles"; display: "review"; articleId: ArticleSchemaType["id"] }
>;

type RenderArticleTabProps = { tab: BookmarkedTab | OpenedArticleTab };

export default function RenderArticleTab({ tab }: RenderArticleTabProps) {
  const dispatch = useDispatch<AppDispatch>();

  const backToArticles = () => {
    dispatch(changeTab({ kind: "articles", display: "main" }));
  };

  switch (tab.display) {
    case "main": {
      return (
        <Suspense
          fallback={
            <DelayedFallback>
              <Pageskeleton />
            </DelayedFallback>
          }
        >
          <SavedArticles />
        </Suspense>
      );
    }
    case "review": {
      return (
        <ArticleReview
          key={tab.articleId}
          articleId={tab.articleId}
          backTo={backToArticles}
        />
      );
    }

    default: {
      return assertNever(tab);
    }
  }
}
