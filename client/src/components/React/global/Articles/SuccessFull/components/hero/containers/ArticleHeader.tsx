import MoreButton from "../../../../buttons/MoreButton";
import SaveArticle from "../../../../buttons/SaveArticle";
import { useState } from "react";
import { motion } from "framer-motion";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import ArticleMetaData from "./ArticleMetaData";
import ArticleImage from "../ArticleImage";
import ArticleTitle from "../ArticleTitle";
import PublishedBy from "../PublishedBy";
import type { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

interface ArticleHeaderProps {
  articleData: ArticleSchemaType;
  investigating?: boolean;
  animateEntrance?: boolean;
}

export default function ArticleHeader({ articleData, investigating, animateEntrance = true }: ArticleHeaderProps): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={animateEntrance ? { opacity: 0 } : false}
      animate={{ opacity: 1, transition: { delay: 0.2, type: "tween", duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="relative rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:p-6"
    >
      <ScrolltoTop />
      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-8">
        <ArticleImage article={articleData} />
        <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-5">
          <PublishedBy article={articleData} />
          <ArticleTitle title={articleData.title} />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 sm:mt-6">
        <ArticleMetaData article={articleData} />
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {investigating && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2 transition-colors hover:bg-white/10 [&_svg]:h-6 [&_svg]:w-6">
              <SaveArticle open={open} article={articleData} />
            </div>
          )}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors hover:bg-white/10">
            <MoreButton open={open} setOpen={setOpen} articleData={articleData} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
