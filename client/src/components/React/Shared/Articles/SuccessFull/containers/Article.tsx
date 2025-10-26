import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrolltoTop from "../../../../../../helpers/ScrollToTop";
import ArticleHeader from "../components/hero/containers/ArticleHeader";
import ArticleContent from "../components/text/ArticleContent";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { useSelector } from "react-redux";
import type { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import type { RootState } from "@/ReduxToolKit/store";

type ArticleProps = {
    articleData: Article | null;
    investigating?: boolean;
};

function preload(src?: string) {
    if (!src) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
    });
}

export default function Article({ articleData, investigating }: ArticleProps): JSX.Element | null {
    if (!articleData) return null
    const initial = articleData!;
    const [displayed, setDisplayed] = useState<Article>(initial);
    const [prev, setPrev] = useState<Article | null>(null);
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { read } = investigateState;
    const { articles, currentStory } = read;

    const renderThisArticle: boolean = investigating ? (displayed.article_url === articles[currentStory].article_url) : true;

    useEffect(() => {
        if (!articleData) return;
        if (articleData.article_url === displayed.article_url) return;

        let cancelled = false;
        setPrev(displayed);

        (async () => {
            await preload(articleData.image_url);
            if (cancelled) return;
            setDisplayed(articleData);
        })();

        return () => {
            cancelled = true;
        };
    }, [articleData, displayed.article_url]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { type: 'tween', delay: 0.3, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { type: 'tween', delay: 0, duration: 0.3 } }}
            className="relative top-0 left-0 right-0 flex flex-col grow px-4 mx-auto
                 w-full lg:max-w-lg xl:max-w-4xl min-h-screen scrollbar-hide
                 bg-black transition-all duration-200 ease-in-out"
        >
            <AnimatePresence mode="wait" initial={false}>
                {renderThisArticle && <motion.div
                    key={articleData.article_url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.25 } }}
                    className="relative"
                >
                    <ArticleHeader articleData={articleData} investigating={investigating} />
                    <ArticleContent
                        article_text={articleData.full_text}
                        article_url={articleData.article_url}
                    />
                </motion.div>}
            </AnimatePresence>




        </motion.div>
    );
}
