import { ListRange, Virtuoso } from "react-virtuoso";
import { useDispatch } from "react-redux";
import SkeletonMap from "../skeletons/SkeletonMap";
import { useProgressiveList } from "@/lib/hooks/dashboard/rendering/useProgressiveList";
import { resolveRestoreIndex } from "@/lib/helpers/scroll/resolveRestoreIndex";
import { useCallback, useState } from "react";
import { useSkeletons } from "@/lib/hooks/dashboard/rendering/useSkeletons";
import { useScrollWithShadow } from "@/lib/hooks/rendering/useScrollWithShadow";
import type { CSSProperties } from "react";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import type { AppDispatch } from "@/state/store";
import {
  changeTab,
  storeScrollPosition,
} from "@/state/Reducers/Dashboard/DashboardSlice";
import { useHandleBookmark } from "@/lib/hooks/dashboard/events/useBookmarkSavedArticles";
import ArticleSurface from "../components/ArticleSurface";
import { stylesWithShadow } from "@/lib/helpers/scroll/stylesWithShadow";
import { ArticleScroller } from "./types";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { useListScrollPosition } from "@/lib/hooks/dashboard/rendering/useListScrollPosition";

export default function ArticlesScroller({
  articles,
  restorePosition,
}: ArticleScroller): JSX.Element | null {
  const { getScrollSnapshot, scrollRef, topIndexRef, topKeyRef } =
    useListScrollPosition(articles.length, "articles");
  const { fastScroll, clockScrollSpeed } = useSkeletons(200);
  const { boxShadow, onScrollHandler } = useScrollWithShadow();
  const articleScrollerStyles: CSSProperties = stylesWithShadow(boxShadow);
  const { deleteBookmark, bookmarks } = useHandleBookmark({
    articles,
  });
  // Restore once per mount, using the same target to seed list disclosure.
  const [restoreIndex] = useState(() =>
    resolveRestoreIndex({
      items: articles,
      listId: "articles",
      restorePosition,
      getKey: (article) => article.id,
    }),
  );
  const { visible, loadMore, fullyLoaded, nextBatchCount } = useProgressiveList(
    articles,
    {
      initialCount: restoreIndex === null ? 8 : Math.max(8, restoreIndex + 11),
    },
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleArticleSelection = useCallback(
    (article: ArticleSchemaType) => {
      return async () => {
        dispatch(
          storeScrollPosition({
            status: "ready",
            position: getScrollSnapshot(),
          }),
        );
        dispatch(
          changeTab({
            kind: "articles",
            display: "review",
            articleId: article.id,
          }),
        );
      };
    },
    [dispatch, getScrollSnapshot],
  );

  return (
    <div
      className="relative w-dvw md:w-full xl:w-[1100px] 2xl:w-[1250px] mx-auto h-dvh overflow-x-hidden 
            px-2 pt-8 md:pt-2 md:hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] transition-shadow duration-200 ease-[cubic-bezier(.2,.6,.2,1)]"
    >
      <ErrorBoundary>
        <Virtuoso
          initialTopMostItemIndex={restoreIndex ?? 0}
          scrollerRef={(el) => {
            scrollRef.current = el;
          }}
          onScroll={onScrollHandler}
          defaultItemHeight={240}
          components={{ Footer: SkeletonMap }}
          context={{
            fullyLoaded,
            numSkeletons: nextBatchCount,
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
            topIndexRef.current = r.startIndex;
            const item = visible[r.startIndex];
            topKeyRef.current = item?.id ?? null;
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
