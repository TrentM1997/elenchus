import type { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { motion } from "framer-motion";
import SearchResults from "../phase2/results/containers/SearchResults";
import ArticleContainer from "@/components/React/global/Articles/containers/ArticleContainer";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import { articleContent } from "@/motion/variants";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderInvestigationContentPhase({
  research,
}: {
  research: Extract<
    UserResearchType,
    { phase: "searching" } | { phase: "evidence" }
  >;
}): JSX.Element {
  switch (research.phase) {
    case "searching":
      return (
        <motion.div
          key="links"
          variants={articleContent}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full min-h-screen mx-auto relative"
        >
          <ScrolltoTop key={`${research.phase}: scrollToTop`} />
          <SearchResults key={`${research.phase}: child-motion.div`} />
        </motion.div>
      );

    case "evidence":
      return (
        <motion.div
          key="articles"
          variants={articleContent}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen w-full mx-auto px-2"
        >
          <ScrolltoTop key={`${research.phase}: scrollToTop`} />
          <ArticleContainer key={`${research.phase}: child-motion.div`} />
        </motion.div>
      );

    default: {
      return assertNever(research);
    }
  }
}
