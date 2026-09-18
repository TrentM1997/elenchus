import { motion } from "framer-motion";
import StoryPaginate from "../components/buttons/StoryPaginate";
import type { Phase } from "@/state/Reducers/Investigate/Rendering";
import type { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { ArticleExtractionState } from "@/state/Reducers/Investigate/articles/types";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function ArticlePagination(): JSX.Element | null {
  const phase: Phase = useSelector(
    (s: RootState) => s.investigation.rendering.phase,
  );
  const articles = useSelector(
    (state: RootState) => state.investigation.read.articles,
  );
  const canAnimate: boolean =
    articles.status !== "pending" &&
    articles.status !== "initial" &&
    phase === "Phase 3";

  const paginationHero: JSX.Element = (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "tween", duration: 0.3, delay: 0.2 }}
      key="spacer-div"
      className="flex items-center w-full h-44 md:h-52 justify-center relative"
    >
      <RenderPagination state={articles} />
    </motion.div>
  );

  if (canAnimate) return paginationHero;

  return null;
}

function RenderPagination({ state }: { state: ArticleExtractionState }) {
  switch (state.status) {
    case "initial":
    case "pending":
      return null;
    case "partial":
    case "ready":
    case "failed":
    case "error": {
      return <StoryPaginate articles={state.data.retrieved} />;
    }

    default: {
      return assertNever(state);
    }
  }
}
