import { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import type { RootState } from "@/ReduxToolKit/store";

export type Priority = 'complete' | 'pending';

interface RenderMetrics {
    priority1: Priority,
    priority2: Priority,
    priority3: Priority
};

interface RenderValues {
    priority1: Priority,
    priority2: Priority,
    priority3: Priority,
    renderFallback: boolean,
    ratingData: number[],
    biasRatings: number[],
    hasInvestigations: boolean
}

export function useRenderMetrics(): RenderValues {
    const userArticles = useSelector((state: RootState) => state.userdata.userArticles);
    const { userResearch, stats } = useSelector((state: RootState) => state.userWork, shallowEqual);
    const hasArticles: boolean = Array.isArray(userArticles) && (userArticles.length > 0);
    const hasInvestigations: boolean = Array.isArray(userResearch) && (userResearch.length > 0);
    const biasRatings = useSelector((state: RootState) => state.chart.biasRatings);
    const ratingData = useSelector((state: RootState) => state.chart.reportingIntegrity);
    const [priority, setPriority] = useState<RenderMetrics>({
        priority1: 'pending',
        priority2: 'pending',
        priority3: 'pending'
    });
    const [renderFallback, setRenderFallback] = useState<boolean>(false);


    useEffect(() => {
        if (!hasArticles) return;
        const priority_one_curr = priority.priority1;
        const priority_two_curr = priority.priority2;
        const upstreamDone = ((priority_one_curr === 'complete' && priority_two_curr === 'complete'))
        if (upstreamDone) return;


        const biasLoaded = (Array.isArray(biasRatings) && biasRatings.length > 0);
        if (biasLoaded) {
            setPriority((prev: RenderMetrics) => ({
                ...prev,
                priority1: 'complete'
            }));
        }

        const ratingsLoaded = (Array.isArray(ratingData) && (ratingData.length > 0));
        if (ratingsLoaded) {
            setPriority((prev: RenderMetrics) => ({
                ...prev,
                priority2: 'complete'
            }));
        };


    }, [ratingData, biasRatings, userArticles, hasArticles, priority]);


    useEffect(() => {
        if (!hasArticles && !hasInvestigations) {
            setRenderFallback(true);
            return;
        }
        if (!hasInvestigations) return;

        const priority_three_curr = priority.priority3;
        if (priority_three_curr === 'complete') return;

        const statsPopulated: boolean = Object.values(stats).some((el: number) => el !== null);

        if (statsPopulated) {
            setPriority((prev: RenderMetrics) => ({
                ...prev,
                priority3: 'complete'
            }));
        };

    }, [userResearch, stats, hasInvestigations, hasArticles, priority]);


    return {
        priority1: priority.priority1,
        priority2: priority.priority2,
        priority3: priority.priority3,
        renderFallback: renderFallback,
        biasRatings: biasRatings,
        ratingData: ratingData,
        hasInvestigations: hasInvestigations
    };
};