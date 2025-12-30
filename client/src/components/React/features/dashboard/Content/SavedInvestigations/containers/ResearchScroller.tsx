import { Virtuoso, ListRange } from "react-virtuoso";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import PriorInvestigation from "../components/InvestigationSaved";
import InvestigationSkeletons from "../skeletons/InvestigationSkeletons";
import { useRef, useCallback } from "react";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import { reviewThisResearch } from "@/state/Reducers/UserContent/UserInvestigations";
import { useSkeletons } from "@/hooks/useSkeletons";
import type { SavedInvestigation } from "./SavedResearchLayout";
import { chooseTab } from "@/state/Reducers/UserContent/DashboardTabs";
import { wait } from "@/helpers/formatting/Presentation";

interface ResearchScroller {
    timeline: SavedInvestigation[]
};

export default function ResearchScroller({ timeline }: ResearchScroller) {
    const restorePosition = useSelector((state: RootState) => state.profileNav.researchScrollPosition);
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
        timeline,
        'investigations',
        restorePosition ?? null,
        timeline[0].id
    );
    const { boxShadow, onScrollHandler } = useScrollWithShadow();
    const dispatch = useDispatch<AppDispatch>();
    const { fastScroll, clockScrollSpeed } = useSkeletons(180);
    const virtuosoRef = useRef();

    const review = useCallback((investigation: any) => {
        return async () => {
            saveNow();
            dispatch(reviewThisResearch(investigation))
            await wait(200);
            dispatch(chooseTab('Review Investigation'));
        }
    }, []);

    return (
        <div
            className="relative px-6 no-scrollbar md:px-0 w-dvw md:w-full xl:w-[1100px] 2xl:w-[1250px] flex items-stretch justify-center h-svh pt-2.5 md:pt-1.5
            overflow-x-hidden hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] ease-[cubic-bezier(.2,.6,.2,1)] transition-shadow duration-200"
        >
            <Virtuoso
                ref={virtuosoRef}
                scrollerRef={(el: HTMLDivElement) => scrollRef.current = el}
                initialTopMostItemIndex={initialTopMostItemIndex}
                style={{
                    height: '94%', width: '100%', display: 'flex', overflowX: 'hidden', overscrollBehavior: 'contain',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'start', boxShadow: boxShadow
                }}
                rangeChanged={(r: ListRange) => {
                    topIndexRef.current = r.endIndex;
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
                context={{ fullyLoaded, numSkeletons }}
                components={{ Footer: InvestigationSkeletons }}
                itemContent={(_, investigation) => {
                    return (
                        <PriorInvestigation inSeek={fastScroll} review={review} investigation={investigation} />
                    )
                }}

            />
        </div>
    );
};