import React from "react";


interface IncrementPage {
    increment: () => void,
    disabled: boolean | null
};


function IncrementPage({ increment, disabled }: IncrementPage): JSX.Element | null {

    return (
        <button
            disabled={disabled}
            onClick={increment}
            className="rounded-r-3xl text-white rounded-l-none
                 border border-white/10 py-2 px-3 text-center text-sm transition-colors ease-soft duration-200
                 shadow-sm hover:shadow-lg  hover:bg-white/20 group
                 ">
            <svg className={`text-white w-4 h-4 lg:w-6 lg:h-6`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
                <path d="M17.586,44.414C17.977,44.805,18.488,45,19,45s1.023-0.195,1.414-0.586l19-19c0.781-0.781,0.781-2.047,0-2.828l-19-19 c-0.781-0.781-2.047-0.781-2.828,0s-0.781,2.047,0,2.828L35.172,24L17.586,41.586C16.805,42.367,16.805,43.633,17.586,44.414z" fill="currentColor" />
            </svg>

        </button>
    )
};



export default React.memo(IncrementPage);
