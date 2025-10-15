import React from "react";
import { limitString } from "@/helpers/Presentation";


interface LinkTitle {
    name?: string
};

function LinkTitle({ name }: LinkTitle) {

    const title = limitString(name, 100)

    return (
        <div className='relative z-10 p-4'>

            <div className="flex flex-col lg:gap-y-6">
                <h1 className='xl:text-lg lg:text-base sm:text-sm text-lg
                 leading-6 text-white font-light tracking-tight'>
                    {title}
                </h1>
            </div>
        </div>
    )
};


export default React.memo(LinkTitle);