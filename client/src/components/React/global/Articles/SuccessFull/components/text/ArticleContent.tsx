import { motion } from "framer-motion";
import FullText from "./FullText";

interface ArticleContentProps {
  article_text: string;
  article_url: string;
  animateEntrance?: boolean;
}

export default function ArticleContent({
  article_text,
  article_url,
  animateEntrance = true,
}: ArticleContentProps): JSX.Element | null {
  return (
    <motion.div
      initial={animateEntrance ? { opacity: 0 } : false}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.2,
          type: "tween",
          duration: 0.3,
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.1,
        },
      }}
      className={``}
    >
      <main className={`display-block opacity-87 h-full w-full`}>
        <FullText article_text={article_text} article_url={article_url} />
      </main>
    </motion.div>
  );
}
