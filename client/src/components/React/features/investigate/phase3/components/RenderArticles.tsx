import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import Article from "@/components/React/Shared/Articles/SuccessFull/containers/Article";
import ArticleLoader from "@/components/React/Shared/Articles/loaders/ArticleLoader";
import NoContent from "@/components/React/Shared/Articles/Failed/NoContent";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";

export default function RenderArticles(): JSX.Element | null {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { read } = investigateState;
    const { articles, currentStory, ContentStatus } = read;
    const renderArticle = Array.isArray(articles) && (articles.length > 0);
    const noResults = useMemo(() => {
        const failed: boolean = (ContentStatus === 'fulfilled') && (Array.isArray(articles)) && (articles.length === 0);
        return failed;
    }, [ContentStatus, articles])
    const showLoader = useMemo((): boolean => {
        const shouldShowLoader: boolean = (ContentStatus === 'pending');
        return shouldShowLoader;
    }, [ContentStatus]);


    return (
        <main

            className="2xl:max-w-6xl h-full w-full mx-auto 
                  mb-12 flex flex-col">
            <div
                className="w-full min-h-screen mx-auto relative
                grow shrink-0"
            >
                <ErrorBoundary>

                    <AnimatePresence mode="wait" initial={false}>
                        {showLoader && <ArticleLoader key="loading-articles" />}
                        {(!showLoader) && (renderArticle) &&
                            (articles[currentStory]) &&
                            <Article
                                key="article"
                                articleData={articles[currentStory]}
                                investigating={true}
                            />
                        }
                    </AnimatePresence>
                </ErrorBoundary>



                {noResults && <NoContent key='noResults' />}

            </div>
        </main>
    )

};