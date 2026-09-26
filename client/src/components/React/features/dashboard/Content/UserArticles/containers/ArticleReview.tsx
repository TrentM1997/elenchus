import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import DetailView from "../../../ProfileNavigation/mobile/DetailView";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";
import { Suspense } from "react";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import PendingState from "@/components/React/global/fallbacks/PendingState";
import Article from "@/components/React/global/Articles/SuccessFull/containers/Article";
import { useHydrateOpenedArticle } from "@/lib/hooks/dashboard/hydration/useHydrateOpenedArticle";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export default function ArticleReview({
  articleId,
  backTo,
}: {
  articleId: ArticleSchemaType["id"];
  backTo: () => void;
}) {
  const { article } = useHydrateOpenedArticle(articleId);

  return (
    <section
      className="min-h-dvh h-dvh pb-[6.5rem] w-full flex items-center justify-center 
                        mx-auto relative mt-16 xl:mt-6"
    >
      <DetailView backTo={backTo} />
      <main
        className="2xl:max-w-7xl xl:w-4/5 lg:max-w-4xl md:w-4/5 grow
                sm:w-3/4  w-80 h-full overflow-y-auto no-scrollbar scroll-smooth scrollbar-gutter-stable-both overscroll-contain
                 xl:px-24
                 "
      >
        <AsyncStateRenderer state={article} pending={() => <ReviewPending />}>
          {(state) => (
            <Suspense fallback={<ReviewPending />}>
              <Article investigating={false} articleData={state} />
            </Suspense>
          )}
        </AsyncStateRenderer>
      </main>
    </section>
  );
}

function ReviewPending() {
  return (
    <DelayedFallback>
      <PendingState
        title="Loading article"
        message="Getting your saved article ready."
      />
    </DelayedFallback>
  );
}
