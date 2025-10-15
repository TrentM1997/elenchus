import React from "react";

interface DecrementPage {
    decrement: () => void,
    disabled: boolean | null
};

function DecrementPage({ decrement, disabled }): JSX.Element | null {

    return (
        <button onClick={decrement}
            disabled={disabled}
            className="rounded-l-3xl border border-r-0 border-white/10
                 py-2 px-3 text-center text-sm shadow-sm 
                 hover:shadow-lg text-white hover:bg-white/20 transition-colors ease-soft duration-200 group">
            <svg className={`text-white w-4 h-4 lg:w-6 lg:h-6`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
                <path d="M 33.960938 2.9804688 A 2.0002 2.0002 0 0 0 32.585938 3.5859375 L 13.585938 22.585938 A 2.0002 2.0002 0 0 0 13.585938 25.414062 L 32.585938 44.414062 A 2.0002 2.0002 0 1 0 35.414062 41.585938 L 17.828125 24 L 35.414062 6.4140625 A 2.0002 2.0002 0 0 0 33.960938 2.9804688 z" fill="currentColor" />
            </svg>
        </button>
    )
}


export default React.memo(DecrementPage);
