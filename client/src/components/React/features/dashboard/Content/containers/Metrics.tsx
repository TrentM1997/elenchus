import { motion } from "framer-motion";
import { lazy, Suspense, useMemo, useRef } from "react";
import ScrolltoTop from "@/helpers/ScrollToTop";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RootState, AppDispatch } from "@/ReduxToolKit/store";
import { variants } from "@/motion/variants";
import { useEffect } from "react";
import { getStatsBreakdown } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";
import type { StatBreakdownTypes } from "@/env";
import ChartJsWrapper from "../UserCharts/ChartJsWrapper";
import StatsSkeleton from "@/components/React/features/charts/skeletons/StatsSkeleton";
import NoSavedContentFallback from "../../fallbacks/NoSavedContentFallback";
import StatsWorker from '@/services/workers/statsWorker.js?worker';
import StatsFallback from "../../../charts/ChartFallbacks/StatsFallback";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import { useRenderMetrics } from "@/hooks/useRenderMetrics";
import ChartFallbackContainer from "../../../charts/ChartFallbacks/FbContainer";
const StatsSection = lazy(() => import('../../../charts/ResearchStats/StatsSection'));


export default function Metrics() {
    const { userResearch } = useSelector((state: RootState) => state.userWork, shallowEqual);
    const { priority1, priority2, priority3, renderFallback, ratingData, biasRatings, hasInvestigations } = useRenderMetrics();
    const dispatch = useDispatch<AppDispatch>();
    const calcRef = useRef<boolean | null>(null);
    const { boxShadow, onScrollHandler } = useScrollWithShadow();


    useEffect(() => {
        if (!hasInvestigations || (priority3 === 'complete')) return;

        const worker = new StatsWorker();
        let raf: any = 0;

        try {

            worker.onmessage = (e: MessageEvent) => {
                const payload: StatBreakdownTypes = e.data.chartData;

                cancelAnimationFrame(raf);

                raf = requestAnimationFrame(() => {
                    dispatch(getStatsBreakdown(payload));
                    calcRef.current = true;
                });
            };

            worker.postMessage(userResearch);

        } catch (error) {
            calcRef.current = false;
            console.error(error);
        }

        return () => {
            worker.terminate();
            if (calcRef.current !== null) calcRef.current = null;
        };

    }, [userResearch]);


    return (
        <motion.section
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.2 }}
            className="w-auto mx-auto h-[94.5%] relative mt-6
             2xl:mx-52 grow p-4 md:p-0"
        >
            <ScrolltoTop
            />


            <article onScroll={onScrollHandler} style={{ boxShadow: boxShadow }} className="h-full w-full flex flex-col justify-start items-center gap-y-24 
            
            overflow-y-auto no-scrollbar scrollbar-gutter-stable-both scroll-smooth overscroll-contain">

                {renderFallback && <NoSavedContentFallback key={'fallback'} />}


                <ChartJsWrapper
                    key={'chartjs-wrapper'}
                    priority1={priority1}
                    priority2={priority2}
                    ratingData={ratingData}
                    biasRatings={biasRatings}
                />

                <Suspense key={'stats-suspense'}
                    fallback={
                        <DelayedFallback
                            key={'delay-stats-fallback'}>
                            <StatsSkeleton
                                key={'stats-skeleton'}
                            />
                        </DelayedFallback>}
                >
                    {(priority1 === 'complete') && (priority2 === 'complete') && (priority3 === 'complete') && <StatsSection />}
                </Suspense>
                {(priority1 === 'failed' && (priority2 === 'failed')) && <ChartFallbackContainer />}


                {(priority3 === 'failed') && <StatsFallback key={'stats-fallback'} />}
            </article>



        </motion.section>
    );
};