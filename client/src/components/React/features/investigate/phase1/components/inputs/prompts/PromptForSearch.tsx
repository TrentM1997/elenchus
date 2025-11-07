import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/ReduxToolKit/store";
import { useIsMobile } from "@/hooks/useIsMobile";
import { limitString } from "@/helpers/Presentation";


function PromptForSearch(): JSX.Element | null {
    const idea: string | null = useSelector((state: RootState) => state.investigation.pov.idea);
    const isMobile = useIsMobile();
    const shortened: string | null = limitString(idea);

    return (
        <div className="w-full h-full flex flex-col gap-y-4">
            {isMobile && <p className="text-sm inline-block xl:text-lg w-fit text-white whitespace-normal 
                            font-light tracking-tight text-left text-wrap">
                The idea: <span className="text-zinc-400 font-light tracking-tight">
                    {shortened ? shortened : idea}
                </span>
            </p>}
            <p className="text-sm lg:text-base xl:text-xl w-fit text-white font-light tracking-tight text-wrap">
                Next, you'll search for news articles on the idea
            </p>
            {!isMobile && <p className="mt-2 text-wrap text-zinc-400 font-light tracking-tight text-xs lg:text-sm xl:text-base w-4/5">
                If you want to change anything for <em className="text-zinc-200">Perspective, Prior Knowledge, Biases</em> or <em className="text-zinc-200">Premises</em>, go back and do so now
            </p>}
        </div>
    );
};


export default React.memo(PromptForSearch);