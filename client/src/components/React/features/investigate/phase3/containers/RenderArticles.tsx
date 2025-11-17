import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import Article from "@/components/React/Shared/Articles/SuccessFull/containers/Article";
import ArticleLoader from "@/components/React/Shared/Articles/loaders/ArticleLoader";
import NoContent from "@/components/React/Shared/Articles/Failed/NoContent";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import { ReadingSliceState } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import PendingExtractions from "../components/notification/PendingExtractions";
import { useEffect } from "react";
import ControlPanel from "../components/controls/ControlPanel";
import type { TooltipDisplayed } from "@/ReduxToolKit/Reducers/Investigate/Rendering";


export default function RenderArticles(): JSX.Element | null {
    const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
    const [showPendingExtractions, setShowPendingExtractions] = useState<boolean>(false);
    const { articles, currentStory, status }: ReadingSliceState = useSelector((state: RootState) => state.investigation.read);
    const canRender = Array.isArray(articles) && (articles.length > 0);
    const noResults = useMemo(() => {
        const failed: boolean = (status === 'fulfilled') && (Array.isArray(articles)) && (articles.length === 0);
        return failed;
    }, [status, articles]);
    const renderControlPanel = (Array.isArray(articles) && (articles.length > 0) || ((status === 'fulfilled')));


    useEffect(() => {
        if (showPendingExtractions || noResults) return;

        if ((!noResults) && (Array.isArray(articles)) && (articles.length > 0) && (status === 'pending')) {
            setShowPendingExtractions(true);
        }
    }, [status, showPendingExtractions, articles, noResults]);


    return (
        <main

            className="h-full w-full mx-auto
                  flex flex-col">
            <AnimatePresence>
                {showPendingExtractions && <PendingExtractions status={status} setShowPendingExtractions={setShowPendingExtractions} />}
            </AnimatePresence>
            <div
                className={`transition-opacity duration-200 ease-soft 2xl:max-w-7xl
                    ${(tooltip === 'Finished Reading Button') ? 'opacity-40' : 'opacity-100'}
                    w-auto min-h-screen mx-auto relative h-auto
                    `}
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
            <AnimatePresence >
                {renderControlPanel && <ControlPanel key={'controls'} />}

            </AnimatePresence>

        </main>
    )
};