import type { JSX } from "react";
import type { ArticleExtractionState } from "@/state/Reducers/Investigate/articles/types";
import { motion } from "framer-motion";
import StoryPaginate from "../components/buttons/StoryPaginate";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderExtractedArticlesPagination({
  state,
}: {
  state: ArticleExtractionState;
}): JSX.Element | null {
  switch (state.status) {
    case "initial":
    case "pending":
    case "failed":
      return null;
    case "partial":
    case "ready":
    case "error": {
      if (state.data.retrieved.length === 0) {
        return null;
      }

      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "tween", duration: 0.3, delay: 0.2 }}
          key="spacer-div"
          className="flex items-center w-full h-44 md:h-52 justify-center relative"
        >
          <StoryPaginate articles={state.data.retrieved} />
        </motion.div>
      );
    }

    default: {
      return assertNever(state);
    }
  }
}
