import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import Page from "./Page"
import { RootState } from "@/state/store"
import { useMemo } from "react";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import LinkPagination from "../components/buttons/LinkPagination";
import { pagesVariants } from "@/motion/variants";
import ResultsSpacer from "../components/skeletons/ResultsSpacer";
import { useTransitionedIndex } from "@/hooks/useTransitionedIndex";
import { useDispatch } from "react-redux";
import { choose, discard } from "@/state/Reducers/Investigate/ChosenArticles";
import { useCallback } from "react";


export default function Pages(): JSX.Element | null {
    const pages = useSelector((state: RootState) => state.investigation.search.pages);
    const status = useSelector((state: RootState) => state.investigation.search.status);
    const articleOptions = useSelector((state: RootState) => state.investigation.search.articleOptions);
    const chosenArticles: SelectedArticle[] = useSelector((state: RootState) => state.investigation.getArticle.chosenArticles);
    const { isPending, displayed } = useTransitionedIndex({});
    const dispatch = useDispatch();
    const renderLinks = useMemo(() => {
        const canMap = Array.isArray(pages) && (pages.length > 0);
        return canMap
    }, [status, pages]);

    const renderPagination = useMemo(() => {
        const hasPages = ((Array.isArray(articleOptions)) && (Array.isArray(pages)) && (pages.length > 1));
        return (hasPages);
    }, [pages, status]);

    const urlHash: Set<string> = useMemo(() => {
        return new Set(chosenArticles?.map((a: SelectedArticle) => a.url));
    }, [chosenArticles]);


    const select = useCallback((article: ArticleType) => {
        const dataForServer: SelectedArticle = {
            url: article.url,
            source: article.provider,
            date: article.date_published,
            logo: article.logo,
            title: article.name,
            image: article.image
        };

        return () => {
            if (urlHash.has(article.url)) {
                const locatedAt = chosenArticles.findIndex((chosen => chosen.url === article.url))
                dispatch(discard(locatedAt))
            } else {
                dispatch(choose(dataForServer));
            }
        };
    }, [chosenArticles, urlHash]);

    return (
        <motion.div
            key='pagesOfLinks'
            variants={pagesVariants}
            initial={false}
            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.3, ease: [0.33, 0, 0.67, 1] } }}
            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, ease: [0.65, 0, 0.35, 1] } }}
            className="relative min-h-dvh inset-0 h-full flex flex-col justify-center items-center grow w-full  lg:w-[68rem] xl:w-[72rem]"
        >
            <ErrorBoundary>
                {renderPagination
                    ? (
                        <LinkPagination
                            disabled={isPending}
                        />
                    )
                    : (
                        <ResultsSpacer />
                    )
                }

                <div
                    className="relative min-h-full grow 
                w-full h-full contain-layout contain-paint"
                >
                    {renderLinks && (pages[displayed]) &&
                        <Page
                            select={select}
                            urlHash={urlHash}
                            key={`page${displayed}`}
                            index={displayed}
                        />
                    }
                </div>
            </ErrorBoundary>
        </motion.div>
    );
};
