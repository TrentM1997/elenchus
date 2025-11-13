import React from "react";

function DashboardOption({ name, children, tab, onSelect, active }: DashboardOption) {


    return (
        <li className="cursor-pointer w-full"
            onClick={onSelect}
        >
            <div className={`
            flex items-center p-2 text-gray-900 rounded-lg dark:text-white w-full
            hover:bg-white/10 group transition-all duration-200 ease-in-out
            ${active ? 'bg-white/10' : ''}`
            }>
                {children}
                <span className="ms-3 text-white xl:text-base md:text-sm font-light">{name}</span>
            </div>
        </li>
    );
};

export default React.memo(DashboardOption)