import { lazy, Suspense, useEffect, useMemo } from "react";
import PieSkeleton from "@/components/React/features/charts/skeletons/PieSkeleton";
import { DonutSkeletonChart } from "@/components/React/features/charts/skeletons/ChartJsSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/ReduxToolKit/store";
import { RootState } from "@/ReduxToolKit/store";
import { getBiasSnapshot, getReportingRatings } from "@/ReduxToolKit/Reducers/UserContent/ChartSlice";
import BiasWebWorker from '@/services/workers/biasSnapshot.js?worker';
import IntegrityWebWorker from '@/services/workers/integrityWorker.js?worker';
import ChartJsSkeleton from "@/components/React/features/charts/skeletons/ChartJsSkeleton";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import { Priority } from "@/hooks/useRenderMetrics";
const BiasChart = lazy(() => import('@/components/React/features/charts/DonutChart/BiasChart'))
const IntegrityChart = lazy(() => import('@/components/React/features/charts/PieChart/IntegrityChart'));


interface ChartJsWrapper {
    priority1: Priority,
    priority2: Priority,
    biasRatings: number[],
    ratingData: number[]
};


export default function ChartJsWrapper({ priority1, priority2, biasRatings, ratingData }: ChartJsWrapper): JSX.Element | null {
    const userArticles = useSelector((state: RootState) => state.userdata.userArticles);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if (!Array.isArray(userArticles) || (userArticles.length === 0)) return;
        if (Array.isArray(ratingData) && (ratingData.length > 0)) return;

        const worker = new IntegrityWebWorker();
        let raf: any = 0;

        worker.onmessage = (e: MessageEvent) => {
            const payload: number[] = e.data;
            cancelAnimationFrame(raf);

            raf = requestAnimationFrame(() => {
                dispatch(getReportingRatings(payload));
            });
        };

        worker.postMessage(userArticles);

        return () => {
            worker.terminate();
        }
    }, [userArticles, ratingData]);


    useEffect(() => {
        if (!userArticles || userArticles.length === 0) return;
        if (Array.isArray(biasRatings) && (biasRatings.length > 0)) return;

        const biasWorker = new BiasWebWorker();
        let raf: any = 0;

        biasWorker.onmessage = (e: MessageEvent) => {
            const payload: number[] = e.data.chartData;
            cancelAnimationFrame(raf);

            raf = requestAnimationFrame(() => {
                dispatch(getBiasSnapshot(payload));
            });
        };

        biasWorker.postMessage(userArticles);

        return () => {
            biasWorker.terminate();
        }

    }, [userArticles])

    return (
        <>
            <Suspense fallback={
                <DelayedFallback key={'delay-skeleton'}>
                    <ChartJsSkeleton key={'skeleton-wrapper'}>
                        <DonutSkeletonChart key={'skeleton-donut'} />
                    </ChartJsSkeleton>
                </DelayedFallback>
            }
            >
                {priority1 === 'complete' && <BiasChart key={'bias-chart'} />}

            </Suspense>


            <Suspense fallback={
                <DelayedFallback key={'delay-pie-skeleton'}>
                    <ChartJsSkeleton key={'wrapper-skeleton'}>
                        <PieSkeleton key={'pie-skeleton'} />
                    </ChartJsSkeleton>
                </DelayedFallback>

            }>
                {(priority2 === 'complete') && (priority1 === 'complete') &&
                    <IntegrityChart key={'integrity-chart'} />}
            </Suspense>
        </>
    );
};