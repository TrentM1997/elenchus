import React from "react"

function ImageSkeleton() {
    return <div className="relative aspect-[16/9] object-cover xl:w-[397.45px] 2xl:w-[448px]
    sm:aspect-[2/1] lg:aspect-[3/2] bg-black/40
    rounded-t-3xl sm:rounded-l-none sm:rounded-r-3xl 
    sm:rounded-tl-none w-full h-full lg:w-[288px]"
    >
    </div>
};

export default React.memo(ImageSkeleton)