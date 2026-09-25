import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import NoSavedArticles from "../fallbacks/NoSavedArticles";
import ArticlesScroller from "./ArticlesScroller";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";

export default function SavedArticles() {
  const articles = useSelector((s: RootState) => s.dash.articles);
  const restorePosition = useSelector(
    (state: RootState) => state.dash.articleScrollPosition,
  );

  return (
    <section className="w-auto  md:w-full h-fit lg:px-10 xl:px-12 2xl:px-16 mx-auto opacity-0 animate-fade-in duration-200 delay-200 ease-soft">
      <ScrolltoTop />

      <div className="w-full md:px-0 2xl:px-2 gap-3 h-full md:mt-12 xl:mt-4 flex justify-center md:justify-end">
        <AsyncStateRenderer state={articles} empty={() => <NoSavedArticles />}>
          {(state) => (
            <ArticlesScroller
              articles={state}
              restorePosition={
                restorePosition.status === "ready"
                  ? restorePosition.position
                  : undefined
              }
            />
          )}
        </AsyncStateRenderer>
      </div>
    </section>
  );
}
