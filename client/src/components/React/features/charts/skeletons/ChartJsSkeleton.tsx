import { useEffect, useState } from "react";


interface ChartJsSkeleton {
    children: JSX.Element | null
};

export default function ChartJsSkeleton({ children }: ChartJsSkeleton): JSX.Element | null {

    return (
        <div
            className="relative xl:h-[576px] xl:w-[1045px]
             lg:p-8 opacity-0 animate-fade-in transition-opacity animation-delay-300ms"
        >
            <ChartSkeletonWrapper>
                {children}
            </ChartSkeletonWrapper>
        </div>
    )
};


interface ChartSkeletonWrapper {
    children: JSX.Element | null
};

export function ChartSkeletonWrapper({ children }): JSX.Element | null {

    return (
        <div className="mx-auto 2xl:max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 pt-8 xl:pt-0 lg:gap-36 xl:gap-x-44 items-center">
                <ChartDescriptionSkeleton />
                {children}
            </div>
        </div>
    )
};



export function DonutSkeletonChart(): JSX.Element | null {

    return (
        <div className="relative flex flex-col gap-y-3 md:items-start items-center justify-center md:pt-0 h-88 w-88 lg:h-112 lg:w-112">
            <LegendSkeleton />
            <SkeletonDonut />
        </div >

    )
};


export function SkeletonDonut(): JSX.Element | null {

    return <div className="relative md:h-88 md:w-88 h-72 w-72 rounded-full border-[88px] border-zinc-800/50  border-t-zinc-800/30 border-l-zinc-800 animate-pulse" />
}


export function LegendSkeleton(): JSX.Element | null {

    return (
        <div className="relative h-fit w-auto mx-auto flex flex-wrap gap-1.5 items-center justify-start box-border">
            {Array.from({ length: 3 }).map((_, i) => (
                <div className={`w-fit flex items-center justify-start gap-y-1 gap-x-2 space-x-1`}>
                    <div key={i} className={`flex items-center space-x-0.5`}>
                        {/* little colored square */}
                        <div className="h-2.5 w-10 rounded-full bg-zinc-700/50" />
                        {/* text placeholder */}
                        <div className="h-2 w-16 rounded bg-zinc-700/50" />
                    </div>
                    <div key={i} className={`flex items-center space-x-0.5`}>
                        {/* little colored square */}
                        <div className="h-2.5 w-10 rounded-full bg-zinc-700/50" />
                        {/* text placeholder */}
                        <div className="h-2 w-16 rounded bg-zinc-700/50" />
                    </div>
                    <div key={i} className={`flex items-center space-x-0.5`}>
                        {/* little colored square */}
                        <div className="h-2.5 w-10 rounded-full bg-zinc-700/50" />
                        {/* text placeholder */}
                        <div className="h-2 w-16 rounded bg-zinc-700/50" />
                    </div>
                </div>

            ))}
        </div>
    )
}



function ChartDescriptionSkeleton(): JSX.Element | null {
    return (
        <section
            role="status"
            aria-busy="true"
            className={`mb-8 xl:w-[466.5px] xl:h-[285px] md:mb-0 rounded-2xl 
                 opacity-40
                  p-6 overflow-hidden`}
        >
            <div className="space-y-4 md:space-y-2">
                {/* Eyebrow: "Comparative Analysis" */}
                <div className="h-4 md:h-5 w-40 md:w-48 rounded-md bg-[length:200%_100%] 
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] animate-shimmer" />

                {/* Title: "Source diversity" */}
                <div className="h-10 md:h-14 w-2/3 rounded-md bg-[length:200%_100%] 
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] animate-shimmer" />

                {/* Subcopy: two lines */}
                <div className="space-y-2">
                    <div className="h-4 md:h-5 w-full md:w-4/5 rounded-md bg-[length:200%_100%] 
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] animate-shimmer" />
                    <div className="h-4 md:h-5 w-2/3 md:w-1/2 rounded-md bg-[length:200%_100%] 
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] animate-shimmer" />
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/10 my-2 md:my-3" />

                {/* Bullet list: three rows with icon + label */}
                <ul className="space-y-3 md:space-y-4">
                    {["w-72 md:w-96", "w-80 md:w-[28rem]", "w-72 md:w-[26rem]"].map(
                        (w, i) => (
                            <li key={i} className="flex items-center gap-3 md:gap-4">
                                {/* check icon placeholder */}
                                <span className="inline-block h-4 w-4 md:h-5 md:w-5 rounded-full bg-[length:200%_100%] 
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] animate-shimmer" />
                                <span className={`block h-4 md:h-5 rounded-md bg-[length:200%_100%] 
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] animate-shimmer ${w}`} />
                            </li>
                        )
                    )}
                </ul>
            </div>

            {/* For screen readers */}
            <span className="sr-only">Loading source diversity card…</span>
        </section>
    );
}