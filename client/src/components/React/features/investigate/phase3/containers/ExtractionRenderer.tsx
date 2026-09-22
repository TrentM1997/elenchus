import NoContent from "@/components/React/global/Articles/Failed/NoContent";
import ArticleLoader from "@/components/React/global/Articles/loaders/ArticleLoader";
import FailedState from "@/components/React/global/fallbacks/FailedState";
import PendingState from "@/components/React/global/fallbacks/PendingState";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { ArticleExtractionState } from "@/state/Reducers/Investigate/articles/types";
import { Suspense, lazy } from "react";
const Article = lazy(
  () =>
    import("@/components/React/global/Articles/SuccessFull/containers/Article"),
);

export default function ExtractionRenderer({
  state,
  page,
}: {
  state: ArticleExtractionState;
  page: number;
}): JSX.Element | null {
  switch (state.status) {
    case "initial": {
      return null;
    }
    case "pending": {
      return <PendingState />;
    }

    case "ready":
    case "error":
    case "partial": {
      const article = state.data.retrieved[page];
      const interruption =
        state.status === "error" ? (
          <FailedState title="Extraction interrupted" message={state.details} />
        ) : null;
      if (!article) {
        if (interruption) return interruption;
        return state.status === "partial" ? <PendingState /> : <NoContent />;
      }
      return (
        <>
          {interruption}
          <Suspense
            fallback={<ArticleLoader />}
            key={"partial-loader-fallback"}
          >
            <Article
              key={article.article_url}
              articleData={article}
              investigating={true}
            />
          </Suspense>
        </>
      );
    }
    case "failed": {
      return <FailedState message={state.details} />;
    }

    default: {
      return assertNever(state);
    }
  }
}
