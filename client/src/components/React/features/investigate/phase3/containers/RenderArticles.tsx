import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import Article from "@/components/React/global/Articles/SuccessFull/containers/Article";
import ArticleLoader from "@/components/React/global/Articles/loaders/ArticleLoader";
import NoContent from "@/components/React/global/Articles/Failed/NoContent";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import { ReadingSliceState } from "@/state/Reducers/Investigate/Reading";
import PendingExtractions from "../components/notification/PendingExtractions";
import { useEffect } from "react";
import ControlPanel from "../components/controls/ControlPanel";
import type { TooltipDisplayed } from "@/state/Reducers/Investigate/Rendering";
import { usePreload } from "@/hooks/content/usePreload";


export default function RenderArticles(): JSX.Element | null {
    const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
    const [showPendingExtractions, setShowPendingExtractions] = useState<boolean>(false);
    const { articles, currentStory, status }: ReadingSliceState = useSelector((state: RootState) => state.investigation.read);
    const canRender = Array.isArray(articles) && (articles.length > 0);
    const noResults = useMemo(() => {
        const failed: boolean = (status === 'fulfilled') && (Array.isArray(articles)) && (articles.length === 0);
        return failed;
    }, [status, articles]);
    const renderControlPanel = (articles.length > 0) || ((status === 'fulfilled'));
    const { displayed } = usePreload(articles[currentStory]);


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
                                key={articles[currentStory].article_url}
                                articleData={displayed}
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