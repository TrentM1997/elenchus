import React, { useMemo, useRef } from "react";

interface PageButton {
    index: number,
    currentPage: number,
    handleNumberedClick: Function
};

function PageButton({ index, currentPage, handleNumberedClick }): JSX.Element | null {
    const isActive = (currentPage === index);

    return (
        <button onClick={() => handleNumberedClick(index, currentPage)}
            className={`${isActive ? 'bg-white/10' : 'bg-black'}
                text-white rounded-md rounded-r-none rounded-l-none border border-r-0 border-white/10 px-3 py-2 lg:py-2 lg:px-4
                 text-center  lg:text-lg transition-colors duration-200 ease-soft  hover:bg-white/10`}>
            {index + 1}
        </button>
    );
};


export default React.memo(PageButton);

