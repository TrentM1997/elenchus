import { motion } from "framer-motion";
import { pagesVariants, searchResultsMotionProps } from "@/motion/variants";
import { useTransitionedIndex } from "@/hooks/useTransitionedIndex";
import { useSelectForExtract } from "@/lib/hooks/useSelectForExtract";
import RenderSearchResultsPagination from "./RenderSearchResultsPagination";
import { searchResultsPagesCSS } from "./styles";
import PageContainer from "./PageContainer";

export default function Pages(): JSX.Element | null {
  const { select, urlHash, pages } = useSelectForExtract();
  const { isPending, displayed } = useTransitionedIndex({});

  return (
    <motion.div
      key="pagesOfLinks"
      variants={pagesVariants}
      initial={false}
      animate={searchResultsMotionProps.open}
      exit={searchResultsMotionProps.closed}
      className={searchResultsPagesCSS}
    >
      <RenderSearchResultsPagination state={pages} disabled={isPending} />
      <PageContainer
        select={select}
        urlHash={urlHash}
        key={`page${displayed}`}
        index={displayed}
      />
    </motion.div>
  );
}
