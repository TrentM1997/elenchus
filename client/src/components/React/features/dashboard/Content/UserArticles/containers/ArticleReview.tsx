import DetailView from "../../../ProfileNavigation/mobile/DetailView";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";
import { Suspense } from "react";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import Article from "@/components/React/global/Articles/SuccessFull/containers/Article";
import { useHydrateOpenedArticle } from "@/lib/hooks/dashboard/hydration/useHydrateOpenedArticle";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { useBookmarkRecords } from "@/lib/hooks/articles/useBookmarkRecords";
import ArticleSkeleton from "@/components/React/global/Articles/skeletons/ArticleSkeleton";

export default function ArticleReview({
  articleId,
  backTo,
}: {
  articleId: ArticleSchemaType["id"];
  backTo: () => void;
}) {
  const { articlesBookmarked } = useBookmarkRecords();
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
        <AsyncStateRenderer
          state={article}
          pending={() => (
            <DelayedFallback>
              <ArticleSkeleton />
            </DelayedFallback>
          )}
        >
          {(state) => (
            <Suspense>
              <Article
                userKind={"authenticated"}
                articleData={state}
                bookmarked={articlesBookmarked.has(articleId)}
              />
            </Suspense>
          )}
        </AsyncStateRenderer>
      </main>
    </section>
  );
}
