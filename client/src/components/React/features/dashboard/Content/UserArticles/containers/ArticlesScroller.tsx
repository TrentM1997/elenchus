import { ListRange, Virtuoso } from "react-virtuoso";
import { useDispatch } from "react-redux";
import SkeletonMap from "../skeletons/SkeletonMap";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { useCallback, useRef } from "react";
import { useSkeletons } from "@/hooks/useSkeletons";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import type { CSSProperties } from "react";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import type { AppDispatch } from "@/state/store";
import { readSavedArticle } from "@/state/Reducers/Dashboard/UserContent/UserContentReducer";
import { chooseTab } from "@/state/Reducers/Dashboard/UserContent/DashboardTabs";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { useHandleBookmark } from "@/hooks/dashboard/useBookmarkSavedArticles";
import ArticleSurface from "../components/ArticleSurface";
import { stylesWithShadow } from "@/lib/helpers/scroll/stylesWithShadow";
import { ArticleScroller } from "./types";
import { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";

export default function ArticlesScroller({
  articles,
  restorePosition,
}: ArticleScroller): JSX.Element | null {
  const virutuosoRef = useRef(null);
  const {
    visible, loadMore, topKeyRef, topIndexRef, saveNow, scrollRef,
    fullyLoaded, numSkeletons,
  } = useVirtuoso(articles, "articles", restorePosition);
  const { fastScroll, clockScrollSpeed } = useSkeletons(200);
  const { boxShadow, onScrollHandler } = useScrollWithShadow();
  const articleScrollerStyles: CSSProperties = stylesWithShadow(boxShadow);
  const { deleteBookmark, bookmarks } = useHandleBookmark({
    articles,
  });
  const dispatch = useDispatch<AppDispatch>();

  const handleArticleSelection = useCallback(
    (article: ArticleSchemaType) => {
      return async () => {
        dispatch(readSavedArticle(article));
        dispatch(chooseTab("Review Article"));
        await wait(200);
        saveNow();
      };
    },
    [dispatch, saveNow],
  );

  return (
    <div
      className="relative w-dvw md:w-full xl:w-[1100px] 2xl:w-[1250px] mx-auto h-dvh overflow-x-hidden 
            px-2 pt-8 md:pt-2 md:hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] transition-shadow duration-200 ease-[cubic-bezier(.2,.6,.2,1)]"
    >
      <ErrorBoundary>
        <Virtuoso
          ref={virutuosoRef}
          scrollerRef={(el) => {
            scrollRef.current = el;
          }}
          onScroll={onScrollHandler}
          defaultItemHeight={240}
          components={{ Footer: SkeletonMap }}
          context={{
            fullyLoaded: fullyLoaded || visible.length >= articles.length,
            numSkeletons: Math.max(0, numSkeletons),
          }}
          computeItemKey={(_, article) => article.id}
          itemContent={(index, article) => {
            return (
              <ArticleSurface
                deleteBookmark={deleteBookmark}
                bookmarks={bookmarks}
                fastScroll={fastScroll}
                select={handleArticleSelection}
                index={index}
                article={article}
              />
            );
          }}
          style={articleScrollerStyles}
          className="no-scrollbar scrollbar-gutter:stable overscroll-contain transition-shadow ease-[cubic-bezier(.2,.6,.2,1)]"
          data={visible}
          endReached={loadMore}
          increaseViewportBy={200}
          isScrolling={clockScrollSpeed}
          rangeChanged={(r: ListRange) => {
            topIndexRef.current = r.endIndex;
            const item = visible[r.startIndex];
            topKeyRef.current = item ? (item as any).id : null;
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
