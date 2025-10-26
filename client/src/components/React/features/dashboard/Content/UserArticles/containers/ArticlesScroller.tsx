import { ListRange, Virtuoso } from "react-virtuoso";
import { useDispatch } from "react-redux";
import ArticleSaved from "../components/ArticleSaved";
import SkeletonMap from "../skeletons/SkeletonMap";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { useCallback, useMemo, useRef, useState } from "react";
import { VirtuosoScrollPos } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
import { saveArticle } from "@/services/supabase/SupabaseData";
import { AnimatePresence } from "framer-motion";
import AuthNotification from "@/components/React/session/notifications/AuthNotification";
import Title from "../components/Title";
import ArticleThumbnail from "../components/ArticleThumbnail";
import { useSkeletons } from "@/hooks/useSkeletons";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import type { CSSProperties } from "react";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { SigninStatus } from "@/hooks/useSignIn";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { readSavedArticle } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import { presentThisArticle } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";

export interface RenderingValues {
    fullyLoaded: boolean | null,
    numSkeletons: number | null
};


function stylesWithShadow(shadow: string): CSSProperties {

    const boxShadow = shadow;

    return {
        height: '94.5%',
        width: '100%',
        boxShadow: boxShadow
    }
}

interface ArticleScroller {
    sortedArticles: Article[] | null,
    markIds: (id: number, deleted: boolean) => void,
    deletedIds: Set<number>,
    restorePosition: VirtuosoScrollPos | null
};

export default function ArticlesScroller({ sortedArticles, markIds, deletedIds, restorePosition }: ArticleScroller): JSX.Element | null {
    const virutuosoRef = useRef(null)
    if (!sortedArticles) return null;
    const {
        visible,
        fullyLoaded,
        loadMore,
        numSkeletons,
        topKeyRef,
        topIndexRef,
        saveNow,
        scrollRef,
        initialTopMostItemIndex
    } = useVirtuoso(
        sortedArticles,
        'articles',
        restorePosition ?? null,
        sortedArticles[0].id
    );
    const { fastScroll, clockScrollSpeed } = useSkeletons(200);
    const { boxShadow, onScrollHandler } = useScrollWithShadow();
    const [status, setStatus] = useState<SigninStatus>('idle');
    const dispatch = useDispatch<AppDispatch>();
    const timerRef = useRef<number | null>(null);
    const articleScrollerStyles: CSSProperties = stylesWithShadow(boxShadow);
    const rendering_values: RenderingValues = useMemo(() => {
        const context = {
            fullyLoaded: fullyLoaded ?? null,
            numSkeletons: numSkeletons ?? null
        };
        return context;
    }, [fullyLoaded, numSkeletons]);


    const handleArticleSelection = useCallback((article: Article) => () => {
        dispatch(readSavedArticle(article));
        dispatch(presentThisArticle());

        timerRef.current = window.setTimeout(() => {

            saveNow();

            timerRef.current = null;
        }, 200);

    }, [dispatch, visible]);

    const deleteHandler = useCallback(
        async (article: Article): Promise<void> => {
            if (status === 'pending') return;
            setStatus('pending')
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
                {(status !== 'idle') &&
                    <AuthNotification
                        status={status}
                        setStatus={setStatus}
                        action="Delete"
                    />}
            </AnimatePresence>

            <ErrorBoundary>
                <Virtuoso
                    ref={virutuosoRef}
                    scrollerRef={(el: HTMLDivElement) => { scrollRef.current = el; }}
                    onScroll={onScrollHandler}
                    defaultItemHeight={240}
                    components={{ Footer: SkeletonMap }}
                    computeItemKey={(_, article) => article.id}
                    initialTopMostItemIndex={initialTopMostItemIndex}
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
                    increaseViewportBy={200}
                    isScrolling={clockScrollSpeed}
                    context={rendering_values}
                    rangeChanged={(r: ListRange) => {
                        topIndexRef.current = r.endIndex;
                        const item = visible[r.startIndex];
                        topKeyRef.current = item ? (item as any).id : null;
                    }}
                />
            </ErrorBoundary>

        </div>
    );
};


