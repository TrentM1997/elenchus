import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import { motion } from "framer-motion";
import { delays } from "@/motion/variants";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import NoSavedArticles from "../fallbacks/NoSavedArticles";
import ArticlesScroller from "./ArticlesScroller";
import { useEffect, useRef } from "react";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";

export default function SavedArticles({}) {
  const articles = useSelector((s: RootState) => s.userdata.articles);
  const restorePosition = useSelector(
    (state: RootState) => state.profileNav.articleScrollPosition,
  );
  const isUnmountingRef = useRef<boolean | null>(null);

  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
    };
  }, []);

  if (restorePosition.status === "initial") return;

  return (
    <motion.section
      variants={delays}
      initial="closed"
      animate="open"
      exit="closed"
      className="w-auto  md:w-full h-fit lg:px-10 xl:px-12 2xl:px-16 mx-auto"
    >
      <ScrolltoTop />

      <div className="w-full md:px-0 2xl:px-2 gap-3 h-full md:mt-12 xl:mt-4 flex justify-center md:justify-end">
        <AsyncStateRenderer state={articles} empty={() => <NoSavedArticles />}>
          {(state) => (
            <ArticlesScroller
              articles={state}
              restorePosition={restorePosition.position}
            />
          )}
        </AsyncStateRenderer>
      </div>
    </motion.section>
  );
}
