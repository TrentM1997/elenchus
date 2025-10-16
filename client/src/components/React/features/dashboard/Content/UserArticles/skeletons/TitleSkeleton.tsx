import React from "react";

function TitleSkeleton() {



    return (

        <div
            className="relative flex flex-col justify-center items-center md:items-start bg-white/5
        h-32 sm:h-40 lg:h-full 2xl:h-full p-5 md:p-5 lg:p-6 xl:p-7 2xl:p-6
        w-full xl:w-[596.19px] 2xl:w-[786px] group transition-opacity duration-200 ease-in-out"
        >
            <div className="h-4 lg:h-6 mt-4 2xl:mt-6 w-4/5 bg-black/60 rounded"
            />
            <div className="h-4 lg:h-6 mt-4 2xl:mt-6 w-4/5  bg-black/60 rounded "
            />
            <div className="h-auto flex gap-x-1.5 items-center justify-between w-4/5">
                <div className="h-2 mt-4 2xl:mt-6  w-1/2  bg-black/60 rounded " />
                <div className="h-2 mt-4 2xl:mt-6  w-1/2  bg-black/60 rounded " />
            </div>
            <div className="h-auto flex gap-x-1.5 items-center justify-between w-4/5">
                <div className="h-2 mt-4 2xl:mt-6 w-1/2  bg-black/60 rounded" />
                <div className="h-2 mt-4 2xl:mt-6 w-1/2 bg-black/60 rounded" />
            </div>

        </div>

    );
};

export default React.memo(TitleSkeleton);