import React from "react";



function SavedTimestamp({ created_at }): JSX.Element | null {
    const timestamp = created_at?.split('').splice(0, 10).join('')

    return (
        <div id="2023-03-16-heading" className="relative pl-7 md:w-1/4 md:pl-0 text-sm font-light tracking-tight md:pr-6 text-white md:text-right">
            <div className='text-zinc-400 absolute h-4 w-32 bottom-1.5 sm:top-1 right-32 sm:right-6'>From: {timestamp}</div>
        </div>
    )
};


export default React.memo(SavedTimestamp);