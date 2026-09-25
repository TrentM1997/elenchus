import { Virtuoso, ListRange } from "react-virtuoso";
import { useProgressiveList } from "@/lib/hooks/dashboard/rendering/useProgressiveList";
import { resolveRestoreIndex } from "@/lib/helpers/scroll/resolveRestoreIndex";
import { useListScrollPosition } from "@/lib/hooks/dashboard/rendering/useListScrollPosition";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import PriorInvestigation from "../components/InvestigationSaved";
import InvestigationSkeletons from "../skeletons/InvestigationSkeletons";
import { useState, useCallback } from "react";
import { useScrollWithShadow } from "@/lib/hooks/rendering/useScrollWithShadow";
import { useSkeletons } from "@/lib/hooks/dashboard/rendering/useSkeletons";
import {
  changeTab,
  storeResearchScrollPosition,
} from "@/state/Reducers/Dashboard/DashboardSlice";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";

interface ResearchScroller {
  timeline: InvestigationSchemaType[];
}

export default function ResearchScroller({ timeline }: ResearchScroller) {
  const restorePosition = useSelector(
    (state: RootState) => state.dash.researchScrollPosition,
  );
  const { getScrollSnapshot, scrollRef, topIndexRef, topKeyRef } =
    useListScrollPosition(timeline.length, "investigations");
  const [restoreIndex] = useState(() =>
    resolveRestoreIndex({
      items: timeline,
      listId: "investigations",
      restorePosition:
        restorePosition.status === "ready"
          ? restorePosition.position
          : undefined,
      getKey: (investigation) => investigation.id,
    }),
  );
  const { visible, fullyLoaded, loadMore, nextBatchCount } = useProgressiveList(
    timeline,
    {
      initialCount: restoreIndex === null ? 8 : Math.max(8, restoreIndex + 11),
    },
  );
  const { boxShadow, onScrollHandler } = useScrollWithShadow();
  const dispatch = useDispatch<AppDispatch>();
  const { fastScroll, clockScrollSpeed } = useSkeletons(180);

  const review = useCallback(
    (investigation: InvestigationSchemaType) => {
      return async () => {
        dispatch(
          storeResearchScrollPosition({
            status: "ready",
            position: getScrollSnapshot(),
          }),
        );
        dispatch(
          changeTab({
            kind: "investigations",
            display: "review",
            current: "investigation",
            investigationId: investigation.id,
          }),
        );
      };
    },
    [dispatch, getScrollSnapshot],
  );

  return (
    <div
      className="relative px-6 no-scrollbar md:px-0 w-dvw md:w-full xl:w-[1100px] 2xl:w-[1250px] flex items-stretch justify-center h-svh pt-2.5 md:pt-1.5 mt-6
            overflow-x-hidden hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] ease-[cubic-bezier(.2,.6,.2,1)] transition-shadow duration-200"
    >
      <Virtuoso
        scrollerRef={(el) => {
          scrollRef.current = el;
        }}
        initialTopMostItemIndex={restoreIndex ?? 0}
        style={{
          height: "94%",
          width: "100%",
          display: "flex",
          overflowX: "hidden",
          overscrollBehavior: "contain",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
          boxShadow: boxShadow,
        }}
        rangeChanged={(r: ListRange) => {
          topIndexRef.current = r.startIndex;
          const item = visible[r.startIndex];
          topKeyRef.current = item?.id ?? null;
        }}
        className="no-scrollbar"
        onScroll={onScrollHandler}
        isScrolling={clockScrollSpeed}
        defaultItemHeight={512}
        data={visible}
        endReached={loadMore}
        increaseViewportBy={200}
        computeItemKey={(_, investigation) => investigation.id}
        context={{ fullyLoaded, numSkeletons: nextBatchCount }}
        components={{ Footer: InvestigationSkeletons }}
        itemContent={(_, investigation) => {
          return (
            <PriorInvestigation
              inSeek={fastScroll}
              review={review}
              investigation={investigation}
            />
          );
        }}
      />
    </div>
  );
}
