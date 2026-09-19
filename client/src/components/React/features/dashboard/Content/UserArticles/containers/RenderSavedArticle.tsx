import { OpenedArticle } from "@/state/Reducers/Dashboard/UserContent/UserContentReducer";
import type { JSX } from "react";
import { lazy, Suspense, useMemo } from "react";
const Article = lazy(
  () =>
    import("@/components/React/global/Articles/SuccessFull/containers/Article"),
);
import ArticleSkeleton from "@/components/React/global/Articles/skeletons/ArticleSkeleton";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import Loader from "@/components/React/global/Loaders/Loader";

interface RenderSavedArticleProps {
  state: OpenedArticle;
}

export default function RenderSavedArticle({
  state,
}: RenderSavedArticleProps): JSX.Element | null {
  switch (state.status) {
    case "initial": {
      return null;
    }

    case "failed": {
      return <div>Error: Failed to hydrate article</div>;
    }
    case "empty": {
      return <div>Content not availale</div>;
    }

    case "pending": {
      return <Loader />;
    }

    case "ready": {
      return (
        <Suspense
          fallback={
            <DelayedFallback>
              <ArticleSkeleton />
            </DelayedFallback>
          }
        >
          <Article investigating={false} articleData={state.data} />
        </Suspense>
      );
    }

    default: {
      return null;
    }
  }
}
