import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import Article from "@/components/React/Shared/Articles/SuccessFull/containers/Article";
import ArticleLoader from "@/components/React/Shared/Articles/loaders/ArticleLoader";
import NoContent from "@/components/React/Shared/Articles/Failed/NoContent";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import { ReadingSliceState } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import PendingExtractions from "./notification/PendingExtractions";
import { useEffect } from "react";

export default function RenderArticles(): JSX.Element | null {
    const [showPendingExtractions, setShowPendingExtractions] = useState<boolean>(false);
    const { articles, currentStory, status }: ReadingSliceState = useSelector((state: RootState) => state.investigation.read);
    const canRender = Array.isArray(articles) && (articles.length > 0);
    const noResults = useMemo(() => {
        const failed: boolean = (status === 'fulfilled') && (Array.isArray(articles)) && (articles.length === 0);
        return failed;
    }, [status, articles]);

    console.log(articles.length);

    useEffect(() => {
        if (showPendingExtractions || noResults) return;

        if ((!noResults) && (Array.isArray(articles)) && (articles.length > 0) && (status === 'pending')) {
            setShowPendingExtractions(true);
        }



    }, [status, showPendingExtractions, articles, noResults]);

    return (
        <main

            className="2xl:max-w-6xl h-full w-full mx-auto
                  mb-12 flex flex-col">
            <AnimatePresence>
                {showPendingExtractions && <PendingExtractions status={status} setShowPendingExtractions={setShowPendingExtractions} />}
            </AnimatePresence>
            <div
                className="w-full min-h-screen mx-auto relative
                grow shrink-0"
            >
                <ErrorBoundary>

                    <AnimatePresence mode="wait" initial={false}>
                        {!canRender && (!noResults) && <ArticleLoader key="loading-articles" />}
                        {(canRender) && (!noResults) &&
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