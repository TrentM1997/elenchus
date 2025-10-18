import { Virtuoso } from "react-virtuoso";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/ReduxToolKit/store";
import PriorInvestigation from "../components/InvestigationSaved";
import InvestigationSkeletons from "../skeletons/InvestigationSkeletons";
import { useRef, useCallback } from "react";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import { reviewThisResearch } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";

export default function ResearchScroller() {
    const investigations = useSelector((state: RootState) => state.userWork.userResearch);
    const newArr = Array.isArray(investigations) ? [...investigations] : [];
    const timeline = newArr.sort((a, b) => b.id - a.id);
    const { visible, fullyLoaded, loadMore, numSkeletons } = useVirtuoso(timeline);
    const { boxShadow, onScrollHandler } = useScrollWithShadow();
    const dispatch = useDispatch<AppDispatch>();
    const timerRef = useRef<number | null>(null);

    const review = useCallback((investigation: any) => {
        timerRef.current = window.setTimeout(() => {
            dispatch(reviewThisResearch(investigation));
            timerRef.current = null;
        }, 150);
    }, []);

    return (
        <div
            className="relative px-6 no-scrollbar md:px-0 w-full flex items-stretch justify-center h-svh pt-1.5
            overflow-x-hidden hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] ease-[cubic-bezier(.2,.6,.2,1)] transition-shadow duration-200"
        >
            <Virtuoso
                style={{
                    height: '94%', width: '100%', display: 'flex', overflowX: 'hidden', overscrollBehavior: 'contain',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'start', boxShadow: boxShadow
                }}
                className="no-scrollbar border"
                onScroll={onScrollHandler}
                defaultItemHeight={512}
                data={visible}
                endReached={loadMore}
                increaseViewportBy={600}
                computeItemKey={(_, investigation) => investigation.id}
                context={{ fullyLoaded, numSkeletons }}
                components={{ Footer: InvestigationSkeletons }}
                itemContent={(_, investigation) => {
                    return (
                        <PriorInvestigation review={review} investigation={investigation} />
                    )
                }}
            />
        </div>
    );
};