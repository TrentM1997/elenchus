import { motion } from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import ScrolltoTop from "@/helpers/ScrollToTop";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RootState, AppDispatch } from "@/ReduxToolKit/store";
import { variants } from "@/motion/variants";
import { useEffect } from "react";
import { getStatsBreakdown } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";
import type { StatBreakdownTypes } from "@/env";
import ChartJsWrapper from "../UserCharts/ChartJsWrapper";
import StatsSkeleton from "@/components/React/features/charts/skeletons/StatsSkeleton";
import MetricsFallback from "../wrappers/MetricsFallback";
import StatsWorker from '@/services/workers/statsWorker.js?worker';
import StatsFallback from "../../../charts/ChartFallbacks/StatsFallback";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
const StatsSection = lazy(() => import('../../../charts/ResearchStats/StatsSection'));


export default function Metrics() {
    const { userResearch, stats } = useSelector((state: RootState) => state.userWork, shallowEqual);
    const hasInvestigations: boolean = Array.isArray(userResearch) && (userResearch.length > 0);
    const statsPopulated: boolean = Object.values(stats).some((el: number) => el !== null);
    const { boxShadow, onScrollHandler } = useScrollWithShadow();
    const calcRef = useRef<boolean | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!hasInvestigations || statsPopulated) return;

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
            key={"dashboard"}
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

                <ChartJsWrapper />

                <Suspense fallback={<DelayedFallback><StatsSkeleton /></DelayedFallback>}>
                    {statsPopulated && <StatsSection />}
                </Suspense>

                {(calcRef.current === false) && <StatsFallback />}
            </article>



        </motion.section>
    );
};