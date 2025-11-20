import { lazy, Suspense } from "react";
import type { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import ComponentLoader from "@/components/React/global/Loaders/ComponentLoader";
import InitialPhase from "../initial/InitialPhase";
const HeroContainer = lazy(() => import('@/components/React/features/investigate/shared/containers/HeroContainer'));


export const renderWorkSpaceHeader = (phase: Phase) => {

    switch (phase) {
        case 'Initial':
            return (
                <InitialPhase key={'initial-phase-renderer'} />
            );

        default: {
            return (
                <Suspense
                    key={'Hero-boundary'}
                    fallback={
                        <DelayedFallback
                            delay={300}
                        >
                            <ComponentLoader />
                        </DelayedFallback>}
                >
                    <HeroContainer />
                </Suspense>
            )
        }
    }
};