import React from "react";

function SkeletonInvestigation() {

    return (
        <div className={`md:flex justify-center w-[342px] h-[404px] sm:h-full sm:w-full
    lg:w-[656px] lg:h-[516px]  xl:w-[880px] xl:h-[512px] relative`}> {/* container element */}
            {/* Timestamp Skeleton */}
            <div className="relative pl-7 md:w-1/4 md:pl-0 text-sm font-light tracking-tight md:pr-6 text-white md:text-right">
                <div className="absolute h-4 w-32 bottom-1.5 sm:top-1 right-32 sm:right-6 bg-[length:200%_100%] 
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] animate-shimmer rounded"/>
            </div>
            {/* Right-hand content block */}
            <div className="relative pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-20 md:pb-24">
                {/* Vertical timeline line */}
                <div className="absolute bottom-0 left-0 w-px bg-blue-400 -top-3 md:top-2.5" />
                {/* Dot */}
                <div className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-black/10 bg-blue-400 md:top-[0.4375rem]" />

                <div className="items-center xl:h-[380.8px] w-80 lg:w-96 xl:w-112">
                    <div className="w-full h-full xl:h-[380.8px] flex flex-col items-start justify-center">
                        {/* Thumbnail box */}
                        <div className="h-40 w-52 lg:h-52 lg:w-60 rounded-2xl bg-[length:200%_100%] animate-shimmer
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] " />

                        {/* Topic label */}

                        <SkeletonDescription />


                        {/* Button placeholder */}
                        <div className="h-9 xl:h-10 w-32">
                            <div className="w-full h-full px-6 rounded-full bg-[length:200%_100%] animate-shimmer
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] " />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};


export default React.memo(SkeletonInvestigation);




function SkeletonDescription(): JSX.Element | null {

    return (
        <div className="sm:w-auto w-80 lg:w-96 xl:w-112 lg:h-24 xl:h-28 flex flex-col gap-2 justify-center items-start">

            <div className="h-6 w-32 bg-[length:200%_100%] animate-shimmer
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)]  rounded"/>
            {/* Idea lines */}

            <div className="w-11/12 h-4 bg-[length:200%_100%] animate-shimmer
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)]  rounded" />
            <div className="xl:hidden w-11/12 h-4 bg-[length:200%_100%] animate-shimmer
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)]  rounded" />
            <div className=" w-11/12 h-4 bg-[length:200%_100%] animate-shimmer
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)]  rounded" />

        </div>
    )
}