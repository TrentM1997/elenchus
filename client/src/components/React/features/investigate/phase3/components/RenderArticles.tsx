import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import Article from "@/components/React/Shared/Articles/SuccessFull/containers/Article";
import ArticleLoader from "@/components/React/Shared/Articles/loaders/ArticleLoader";
import NoContent from "@/components/React/Shared/Articles/Failed/NoContent";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import { ReadingSlice } from "@/ReduxToolKit/Reducers/Investigate/Reading";

export default function RenderArticles(): JSX.Element | null {
    const { articles, currentStory, progress, status, failedNotifications }: ReadingSlice = useSelector((state: RootState) => state.investigation.read);
    const canRender = Array.isArray(articles) && (articles.length > 0);
    const noResults = useMemo(() => {
        const failed: boolean = (status === 'fulfilled') && (Array.isArray(articles)) && (articles.length === 0);
        return failed;
    }, [status, articles]);
    const showLoader = (status === 'pending');

    console.log({
        loader: showLoader,
        articles: canRender,
        fallback: noResults,
        progress: progress,
        failedNotifications: failedNotifications
    });

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
                        {(!showLoader) && (canRender) &&
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