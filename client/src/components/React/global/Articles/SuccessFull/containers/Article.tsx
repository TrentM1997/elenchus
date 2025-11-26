import { motion } from "framer-motion";
import ArticleHeader from "../components/hero/containers/ArticleHeader";
import ArticleContent from "../components/text/ArticleContent";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { softEase } from "@/motion/variants";

type ArticleProps = {
    articleData: Article | null;
    investigating?: boolean;
};

export default function Article({ articleData, investigating }: ArticleProps): JSX.Element | null {
    if (!articleData) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.3, ease: softEase } }}
            exit={{ opacity: 0, transition: { type: 'tween', delay: 0, duration: 0.3, ease: softEase } }}
            className="relative top-0 left-0 right-0 flex flex-col grow px-4 mx-auto
                 w-full lg:max-w-2xl xl:max-w-4xl min-h-screen scrollbar-hide
                 bg-black transition-all duration-200 ease-in-out"
        >
            <div
                className="relative"
            >
                <ArticleHeader articleData={articleData} investigating={investigating} />
                <ArticleContent
                    article_text={articleData.full_text}
                    article_url={articleData.article_url}
                />
            </div>
        </motion.div>
    );
}
