import { Virtuoso } from "react-virtuoso";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/ReduxToolKit/store";
import ArticleSaved from "../components/ArticleSaved";
import SkeletonMap from "../skeletons/SkeletonMap";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { readSavedArticle } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer"
import { useCallback, useMemo, useState } from "react";
import { presentThisArticle } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
import { saveArticle } from "@/services/supabase/SupabaseData";
import { AnimatePresence } from "framer-motion";
import AuthNotification from "@/components/React/session/notifications/AuthNotification";
import { deleteArticleStatus } from "@/components/React/session/notifications/AuthStatus";
import Title from "../components/Title";
import ArticleThumbnail from "../components/ArticleThumbnail";
import { useSkeletons } from "@/hooks/useSkeletons";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import type { CSSProperties } from "react";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { SigninStatus } from "@/hooks/useSignIn";


export interface RenderingValues {
    fullyLoaded: boolean | null,
    numSkeletons: number | null
};

export default function ArticlesScroller({ handleArticleSelection }): JSX.Element | null {
    const userArticles: Article[] | null = useSelector((state: RootState) => state.userdata.userArticles);
    const sortedArticles = useMemo(() => {
        const artcs = userArticles
            ? userArticles.slice()
            : null;
        const sorted = artcs?.sort((a: Article, b: Article) => b.id - a.id);
        return sorted;
    }, []);
    if (!sortedArticles) return null;
    const { visible, fullyLoaded, loadMore, numSkeletons } = useVirtuoso(sortedArticles);
    const { fastScroll, clockScrollSpeed } = useSkeletons(200);
    const { boxShadow, onScrollHandler } = useScrollWithShadow();
    const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
    const [status, setStatus] = useState<SigninStatus>(null);

    const rendering_values: RenderingValues = useMemo(() => {
        const context = {
            fullyLoaded: fullyLoaded ?? null,
            numSkeletons: numSkeletons ?? null
        };
        return context;
    }, [fullyLoaded, numSkeletons]);


    const articleScrollerStyles: CSSProperties = {
        height: '94.5%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'end',
        overscrollBehavior: 'contain',
        overflowX: 'hidden',
        boxShadow: boxShadow
    };

    const markIds = (id: number, deleted: boolean) => {
        setDeletedIds(prev => {
            const next = new Set(prev);
            deleted ? next.add(id) : next.delete(id);
            return next;
        });
    };


    const deleteHandler = useCallback(
        async (article: Article): Promise<void> => {
            if (status) return;

            try {
                const results = await saveArticle(article, true);
                if (results.data.message === "Deleted") {
                    setStatus('success')
                    markIds(article.id, true)
                } else {
                    setStatus('failed')
                };

            } catch (err) {
                setStatus('failed');
                console.error(err);
            };
        }, [status]);

    return (
        <div
            className="relative w-dvw md:w-full xl:w-[1100px] 2xl:w-[1250px] mx-auto h-dvh overflow-x-hidden 
            px-2 pt-8 md:pt-2 md:hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] transition-shadow duration-200 ease-[cubic-bezier(.2,.6,.2,1)]"
        >
            <AnimatePresence>
                {status &&
                    <AuthNotification
                        status={status}
                        setStatus={setStatus}
                        action="Deleting"
                    />}
            </AnimatePresence>


            <ErrorBoundary>
                <Virtuoso
                    onScroll={onScrollHandler}
                    defaultItemHeight={240}
                    components={{ Footer: SkeletonMap }}
                    computeItemKey={(_, article) => article.id}
                    itemContent={(index, article) => {
                        return (<ArticleSaved>
                            <Title article={article} handleArticleSelection={handleArticleSelection} />
                            <ArticleThumbnail isPriority={(index <= 5)} articleDeleted={deletedIds.has(article.id)} fastScroll={fastScroll} article={article} deleteHandler={deleteHandler} />
                        </ArticleSaved>)
                    }}
                    style={articleScrollerStyles}
                    className="no-scrollbar scrollbar-gutter:stable overscroll-contain transition-shadow ease-[cubic-bezier(.2,.6,.2,1)]"
                    data={visible}
                    endReached={loadMore}
                    increaseViewportBy={800}
                    isScrolling={clockScrollSpeed}
                    context={rendering_values}

                />
            </ErrorBoundary>

        </div>
    );
};


