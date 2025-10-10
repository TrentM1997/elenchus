import { motion } from "framer-motion"
import FullText from "./FullText";

interface ArticleContentProps {
    article_text: string,
    article_url?: string
};

export default function ArticleContent({ article_text, article_url }: ArticleContentProps): JSX.Element | null {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1, transition: {
                    delay: 0.2,
                    type: 'tween',
                    duration: 0.3
                }
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.1
                }
            }}
            className={``}>
            <main className={`display-block opacity-87 h-full 2xl:w-full`}>
                <FullText article_text={article_text} article_url={article_url} />
            </main>
        </motion.div>
    );
};