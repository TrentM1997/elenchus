import { lazy, Suspense } from "react";
import InputOptions from "../phase1/components/paths/InputOptions";
import BlueSkySkeleton from "../../blueSky/skeletons/BlueSkySkeleton";
import type { PathSelected } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
const BlueSkyPosts = lazy(() => import('@/components/React/features/blueSky/Containers/BlueSky'));
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";


export const renderInitialPhase = (path: PathSelected): JSX.Element | null => {

    switch (path) {
        case "Choose Path":
            return (
                <InputOptions key={'input-options'} />
            );
        case "BlueSky Feed":
            return (
                <Suspense
                    key={'Bluesky-boundary'}
                    fallback={
                        <DelayedFallback >
                            <BlueSkySkeleton context={'investigate'} />
                        </DelayedFallback>
                    }>
                    <BlueSkyPosts context={'investigate'} />
                </Suspense>
            )

        default: {
            const exhaustive: never = path;
            return null;
        };
    };
};


