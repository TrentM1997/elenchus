import { Virtuoso } from "react-virtuoso";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/ReduxToolKit/store";
import PriorInvestigation from "../components/InvestigationSaved";
import InvestigationSkeletons from "../skeletons/InvestigationSkeletons";
import { useRef, useCallback } from "react";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import { reviewThisResearch } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";
import { useSkeletons } from "@/hooks/useSkeletons";
import { presentThisInvestigation } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";

export default function ResearchScroller() {
    const investigations = useSelector((state: RootState) => state.userWork.userResearch);
    const newArr = Array.isArray(investigations) ? [...investigations] : [];
    const timeline = newArr.sort((a, b) => b.id - a.id);
    const { visible, fullyLoaded, loadMore, numSkeletons } = useVirtuoso(timeline);
    const { boxShadow, onScrollHandler } = useScrollWithShadow();
    const dispatch = useDispatch<AppDispatch>();
    const { fastScroll, clockScrollSpeed } = useSkeletons(180);

    const review = useCallback((investigation: any) => {
        dispatch(reviewThisResearch(investigation))
        setTimeout(() => {
            dispatch(presentThisInvestigation());
        }, 150);
    }, []);

    return (
        <div
            className="relative px-6 no-scrollbar md:px-0 w-dvw md:w-full xl:w-[1100px] 2xl:w-[1250px] flex items-stretch justify-center h-svh pt-2.5 md:pt-1.5
            overflow-x-hidden hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] ease-[cubic-bezier(.2,.6,.2,1)] transition-shadow duration-200"
        >
            <Virtuoso
                style={{
                    height: '94%', width: '100%', display: 'flex', overflowX: 'hidden', overscrollBehavior: 'contain',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'start', boxShadow: boxShadow
                }}
                className="no-scrollbar"
                onScroll={onScrollHandler}
                isScrolling={clockScrollSpeed}
                defaultItemHeight={512}
                data={visible}
                endReached={loadMore}
                increaseViewportBy={500}
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