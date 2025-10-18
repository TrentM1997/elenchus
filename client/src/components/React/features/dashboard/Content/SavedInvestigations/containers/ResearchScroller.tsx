import { Virtuoso } from "react-virtuoso";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import PriorInvestigation from "../components/InvestigationSaved";
import InvestigationSkeletons, { InvestigationSkeleton } from "../skeletons/InvestigationSkeletons";
import { useState, useRef } from "react";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function ResearchScroller() {
    const [inSeek, setInSeek] = useState<boolean>(false)
    const investigations = useSelector((state: RootState) => state.userWork.userResearch);
    const newArr = Array.isArray(investigations) ? [...investigations] : [];
    const timeline = newArr.sort((a, b) => b.id - a.id);
    const { visible, fullyLoaded, loadMore } = useVirtuoso(timeline);
    const { boxShadow, onScrollHandler } = useScrollWithShadow();
    const scrollRef = useRef<number | null>(null)
    const enter_velocity: number = 550;
    const exit_velocity: number = 10;
    const dwell_velocity: number = 250;
    const isMobile = useIsMobile();
    const VIRTUOSO_HEIGHT: string = isMobile ? '88%' : '94%';

    return (
        <div
            className="relative px-6 no-scrollbar md:px-0 w-full flex items-stretch justify-center h-svh pt-1.5
            overflow-x-hidden hover:shadow-[0_0_10px_rgba(255,255,255,0.03)] ease-[cubic-bezier(.2,.6,.2,1)] transition-shadow duration-200"
        >
            <Virtuoso
                style={{
                    height: '94%', width: '100%', display: 'flex', overflowX: 'hidden', overscrollBehavior: 'contain',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'end', boxShadow: boxShadow
                }}
                className="no-scrollbar"
                onScroll={onScrollHandler}
                data={visible}
                endReached={loadMore}
                increaseViewportBy={600}
                computeItemKey={(_, investigation) => investigation.id}
                context={{ fullyLoaded }}
                components={{ Footer: InvestigationSkeletons }}
                itemContent={(_, investigation) => {
                    return (
                        <PriorInvestigation investigation={investigation} />
                    )
                }}
            />
        </div>
    );
};