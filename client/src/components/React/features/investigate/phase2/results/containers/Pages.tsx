import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Page from "./Page";
import { RootState } from "@/state/store";
import { useMemo } from "react";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import LinkPagination from "../components/buttons/LinkPagination";
import { pagesVariants } from "@/motion/variants";
import ResultsSpacer from "../components/skeletons/ResultsSpacer";
import { useTransitionedIndex } from "@/hooks/useTransitionedIndex";
import { useDispatch } from "react-redux";
import {
  choose,
  SelectedArticles,
} from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { useCallback } from "react";

export default function Pages(): JSX.Element | null {
  const pages = useSelector(
    (state: RootState) => state.investigation.search.pages,
  );
  const status = useSelector(
    (state: RootState) => state.investigation.search.status,
  );
  const articleOptions = useSelector(
    (state: RootState) => state.investigation.search.articleOptions,
  );
  const selected: SelectedArticles = useSelector(
    (state: RootState) => state.investigation.getArticle.selected,
  );
  const { isPending, displayed } = useTransitionedIndex({});
  const dispatch = useDispatch();
  const renderLinks = useMemo(() => {
    const canMap = Array.isArray(pages) && pages.length > 0;
    return canMap;
  }, [status, pages]);

  const renderPagination = useMemo(() => {
    const hasPages =
      Array.isArray(articleOptions) && Array.isArray(pages) && pages.length > 1;
    return hasPages;
  }, [pages, status]);

  const urlHash: Set<string> = useMemo(() => {
    if (selected.status === "empty") return new Set("");
    return new Set(selected.data?.map((a: SelectedArticle) => a.url));
  }, [selected]);

  const select = useCallback(
    (article: SelectedArticle) => {
      return () => {
        if (selected.status !== "empty" && urlHash.has(article.url)) {
          const clicked = selected.data.find((art) => art.url === article.url);

          if (!clicked) {
            dispatch(choose(article));
          }
        } else {
          dispatch(choose(article));
        }
      };
    },
    [selected, urlHash],
  );

  return (
    <motion.div
      key="pagesOfLinks"
      variants={pagesVariants}
      initial={false}
      animate={{
        opacity: 1,
        transition: { type: "tween", duration: 0.3, ease: [0.33, 0, 0.67, 1] },
      }}
      exit={{
        opacity: 0,
        transition: { type: "tween", duration: 0.2, ease: [0.65, 0, 0.35, 1] },
      }}
      className="relative min-h-dvh inset-0 h-full flex flex-col justify-center items-center grow w-full  lg:w-[68rem] xl:w-[72rem]"
    >
      <ErrorBoundary>
        {renderPagination ? (
          <LinkPagination disabled={isPending} />
        ) : (
          <ResultsSpacer />
        )}

        <div
          className="relative min-h-full grow 
                w-full h-full contain-layout contain-paint"
        >
          {renderLinks && pages.status === "ready" && pages.data[displayed] && (
            <Page
              select={select}
              urlHash={urlHash}
              key={`page${displayed}`}
              index={displayed}
            />
          )}
        </div>
      </ErrorBoundary>
    </motion.div>
  );
}
