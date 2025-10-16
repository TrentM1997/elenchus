import { useMemo } from "react";
import SavedArticleSkeleton from "../skeletons/SavedArticleSkeleton";
import React from "react";

interface SkeletonMap {
    context: {
        fullyLoaded: boolean,
        numSkeletons: number | null,
    };
};

function SkeletonMap({ context }: SkeletonMap): JSX.Element | null {

    const { fullyLoaded, numSkeletons } = context;
    const SKELETON_HEIGHT: number = 240;
    const MAP_HEIGHT: number = (numSkeletons * SKELETON_HEIGHT);
    const reservedSpace: number = fullyLoaded ? 0 : MAP_HEIGHT;

    return (
        <div
            id='skeleton-loaders'
            style={{ height: reservedSpace }}
            className={`relative w-auto flex
             mx-auto flex-col items-center justify-start transition-opacity duration-200 ease-soft
             transform-gpu will-change-[opacity]
             ${fullyLoaded ? 'opacity-0' : 'opacity-100'}
             `}
        >
            {!fullyLoaded &&
                Array.from({ length: numSkeletons ?? 0 }, (_, i) => (<SavedArticleSkeleton key={i} />))
            }
        </div>
    );
};


export default React.memo(SkeletonMap);