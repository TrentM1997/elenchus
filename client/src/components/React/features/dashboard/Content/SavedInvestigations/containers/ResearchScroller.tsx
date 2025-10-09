import { Virtuoso } from "react-virtuoso";
import { useVirtuoso } from "@/hooks/useVirtuoso";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import PriorInvestigation from "../components/InvestigationSaved";
import InvestigationSkeletons, { InvestigationSkeleton } from "../skeletons/InvestigationSkeletons";
import { useState, useRef } from "react";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";

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


    return (
        <div
            className="relative px-4 md:px-0 w-full flex items-stretch justify-center h-svh pt-1.5
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
                context={{ fullyLoaded, inSeek }}
                components={{ Footer: InvestigationSkeletons, ScrollSeekPlaceholder: InvestigationSkeleton }}
                itemContent={(_, investigation, inSeek) => {
                    return (
                        <PriorInvestigation inSeek={inSeek} investigation={investigation} />
                    )
                }}
                scrollSeekConfiguration={{
                    enter: (velocity) => {
                        const shouldEnter: boolean = Math.abs(velocity) > enter_velocity;
                        if (shouldEnter) {
                            setInSeek(true);
                        };
                        return shouldEnter;
                    },
                    exit: (velocity) => {
                        const currentScrollSpeed: number = performance.now();
                        const shouldExit: boolean = (Math.abs(velocity) < exit_velocity);
                        if (shouldExit) {
                            if (scrollRef.current === null) scrollRef.current = currentScrollSpeed;
                            const stable = (currentScrollSpeed - scrollRef.current) >= dwell_velocity;

                            if (stable) {
                                scrollRef.current = null
                                setInSeek(false)
                            };

                            return stable;
                        }
                        return shouldExit;
                    },

                }}
            />
        </div>
    );
};