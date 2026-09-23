import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import DetailView from "../../../ProfileNavigation/mobile/DetailView";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";
import { Suspense } from "react";
import ArticleLoader from "@/components/React/global/Articles/loaders/ArticleLoader";
import Article from "@/components/React/global/Articles/SuccessFull/containers/Article";
import { useHydrateOpenedArticle } from "@/lib/hooks/useHydrateOpenedArticle";
import { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";

export default function ArticleReview({
  articleId,
  backTo,
}: {
  articleId: ArticleSchemaType["id"];
  backTo: () => void;
}) {
  useHydrateOpenedArticle(articleId);
  const article = useSelector((s: RootState) => s.dash.ArticleToReview);

  return (
    <motion.section
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.4, delay: 0.7 }}
      className="min-h-dvh h-dvh pb-[6.5rem] w-full flex items-center justify-center overflow-hidden
                        mx-auto relative mt-16 xl:mt-6"
    >
      <DetailView backTo={backTo} />

      <main
        className="2xl:max-w-7xl xl:w-4/5 lg:max-w-4xl md:w-4/5 grow
                sm:w-3/4  w-80 h-full overflow-y-auto no-scrollbar scroll-smooth scrollbar-gutter-stable-both overscroll-contain
                 xl:px-24
                 "
      >
        <AsyncStateRenderer state={article}>
          {(state) => (
            <Suspense fallback={<ArticleLoader />}>
              <Article investigating={false} articleData={state} />
            </Suspense>
          )}
        </AsyncStateRenderer>
      </main>
    </motion.section>
  );
}
