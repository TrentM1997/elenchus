import { Virtuoso, ListRange } from "react-virtuoso";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import PriorInvestigation from "../components/InvestigationSaved";
import InvestigationSkeletons from "../skeletons/InvestigationSkeletons";
import { useRef, useCallback } from "react";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import { useSkeletons } from "@/hooks/useSkeletons";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";
import { InvestigationSchemaType } from "@/lib/schemas/investigations/InvestigationSchema";

interface ResearchScroller {
  timeline: InvestigationSchemaType[];
}

export default function ResearchScroller({ timeline }: ResearchScroller) {
  const restorePosition = useSelector(
    (state: RootState) => state.dash.researchScrollPosition,
  );
  const {
    visible,
    fullyLoaded,
    loadMore,
    numSkeletons,
    topKeyRef,
    topIndexRef,
    saveNow,
    scrollRef,
    initialTopMostItemIndex,
  } = useVirtuoso(
    timeline,
    "investigations",
    restorePosition?.status === "ready" ? restorePosition.position : undefined,
  );
  const { boxShadow, onScrollHandler } = useScrollWithShadow();
  const dispatch = useDispatch<AppDispatch>();
  const { fastScroll, clockScrollSpeed } = useSkeletons(180);
  const virtuosoRef = useRef();

  const review = useCallback((investigation: any) => {
    return async () => {
      saveNow();
      dispatch(changeTab({ kind: "investigations", display: "review", current: "investigation", investigationId: investigation.id }));
    };
  }, [dispatch, saveNow]);

  return (
    <div
      className="relative px-6 no-scrollbar md:px-0 w-dvw md:w-full xl:w-[1100px] 2xl:w-[1250px] flex items-stretch justify-center h-svh pt-2.5 md:pt-1.5
            overflow-x-hidden hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] ease-[cubic-bezier(.2,.6,.2,1)] transition-shadow duration-200"
    >
      <Virtuoso
        ref={virtuosoRef}
        scrollerRef={(el: HTMLDivElement) => (scrollRef.current = el)}
        initialTopMostItemIndex={initialTopMostItemIndex}
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
          topKeyRef.current = item ? (item as any).id : null;
        }}
        className="no-scrollbar"
        onScroll={onScrollHandler}
        isScrolling={clockScrollSpeed}
        defaultItemHeight={512}
        data={visible}
        endReached={loadMore}
        increaseViewportBy={200}
        computeItemKey={(_, investigation) => investigation.id}
        context={{ fullyLoaded: fullyLoaded || visible.length >= timeline.length, numSkeletons: Math.max(0, numSkeletons) }}
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
