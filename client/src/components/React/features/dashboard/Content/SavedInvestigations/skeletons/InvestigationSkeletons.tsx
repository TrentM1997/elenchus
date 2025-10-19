import { useMemo } from "react";
import SkeletonInvestigation from "./SkeletonInvestigation";



export default function InvestigationSkeletons({ context }) {

    const { fullyLoaded, numSkeletons } = context;


    const SKELETON_HEIGHT: number = 512;
    const MAP_HEIGHT: number = (numSkeletons * SKELETON_HEIGHT);
    const reservedSpace: number = fullyLoaded ? 0 : MAP_HEIGHT;




    return (
        <div
            id='skeleton-loaders'
            style={{ height: reservedSpace }}
            className="relative w-auto xl:w-[880px] mx-auto flex 
                flex-col items-end justify-center"
        >
            {!fullyLoaded &&
                Array.from({ length: 4 }, (_, i) => (<SkeletonInvestigation key={i} />))
            }
        </div>
    );
};

