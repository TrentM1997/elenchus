import { motion } from "framer-motion";
import ArticleHeader from "../components/hero/containers/ArticleHeader";
import ArticleContent from "../components/text/ArticleContent";
import { softEase } from "@/motion/variants";
import { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";

type ArticleProps = {
  articleData: ArticleSchemaType;
  investigating?: boolean;
  animateEntrance?: boolean;
};

export default function Article({
  articleData,
  investigating,
  animateEntrance = true,
}: ArticleProps): JSX.Element | null {
  if (!articleData) return null;

  return (
    <motion.div
      initial={animateEntrance ? { opacity: 0 } : false}
      animate={{
        opacity: 1,
        transition: { type: "tween", duration: 0.3, ease: softEase },
      }}
      exit={{
        opacity: 0,
        transition: { type: "tween", delay: 0, duration: 0.3, ease: softEase },
      }}
      className="relative top-0 left-0 right-0 flex flex-col grow  mx-auto
                 w-full lg:max-w-2xl xl:max-w-5xl min-h-screen scrollbar-hide
                 bg-black"
    >
      <div className="relative">
        <ArticleHeader
          articleData={articleData}
          investigating={investigating}
          animateEntrance={animateEntrance}
        />
        <ArticleContent
          article_text={articleData.full_text}
          article_url={articleData.article_url}
          animateEntrance={animateEntrance}
        />
      </div>
    </motion.div>
  );
}
