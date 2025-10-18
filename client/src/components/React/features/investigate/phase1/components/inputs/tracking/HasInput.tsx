import React from "react";


function HasInput({ hasInput }): JSX.Element | null {

    return (
        <div aria-hidden="true" className="pointer-events-none absolute top-0.5 right-1 w-5 h-5 flex items-center justify-center rounded-full overflow-hidden text-green-600">
            {hasInput
                ? <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="currentColor"
                    className="opacity-0 animate-fade-in transition-opacity animation-delay-200ms icon icon-tabler icons-tabler-filled icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>

                : null}
        </div>
    )
};


export default React.memo(HasInput);