import React from "react";

interface OpenInvestigation {
    investigation: any,
    inSeek?: boolean,
    review: (investigation: any) => () => Promise<void>
};

function OpenInvestigation({ investigation, review }: OpenInvestigation): JSX.Element | null {



    return (
        <div className="h-9 xl:h-10 w-32 relative -left-1">
            <button
                type="button"
                id="Open past investigation"
                aria-label="Open past investigation"
                onClick={review(investigation)} className="text-sm w-full h-full px-6 border focus:ring-2 rounded-full border-transparent bg-white hover:bg-white/10
                            text-black duration-200 focus:ring-offset-2 focus:ring-black hover:text-white inline-flex items-center justify-start ring-1 ring-transparent">
                Review <span className="ml-2">&#8594;</span>
            </button>
        </div>
    )
};


export default React.memo(OpenInvestigation);