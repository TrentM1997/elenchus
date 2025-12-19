import Thumbnail from "./Thumbnail"
import Topic from "./Topic";
import OpenInvestigation from "../buttons/OpenInvestigation";
import React from "react";
import SavedTimestamp from "./SavedTimestamp";

interface PriorInvestigation {
    investigation: any,
    inSeek?: boolean,
    review: (investigation: any) => () => Promise<void>
};

function PriorInvestigation({ investigation, review, inSeek }: PriorInvestigation) {

    return (
        <div className={` 
        md:flex w-[342px] h-[512px] sm:h-full sm:w-full lg:w-[656px] lg:h-[516px] xl:min-h-[32rem] xl:w-[880px] xl:h-[512px] mx-auto`}>
            <SavedTimestamp created_at={investigation.created_at} />
            <div className="relative h-full pt-2 pl-7 md:w-3/4 md:pt-0 md:pl-12 pb-16 md:pb-24">
                <div className="absolute bottom-0 left-0 w-px bg-blue-400 -top-3 md:top-2.5" />
                <div className="absolute -top-[1.0625rem] -left-1 h-[0.5625rem] w-[0.5625rem] rounded-full border-2 border-black/10 bg-blue-400 md:top-[0.4375rem]">
                </div>
                <div className="flex flex-col justify-start start gap-4 h-full w-80 lg:w-96 xl:w-112">
                    <Thumbnail inSeek={inSeek} investigation={investigation} />
                    <div className='w-full flex flex-col items-start justify-center gap-2 px-1 md:px-0.5'>

                        <Topic topic={investigation.idea} />
                        <OpenInvestigation review={review} investigation={investigation} />
                    </div>
                </div>
            </div>

        </div>
    );
};


export default React.memo(PriorInvestigation);