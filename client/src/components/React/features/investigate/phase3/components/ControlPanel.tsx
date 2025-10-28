import TakeNotes from "../buttons/TakeNotes";
import { FinishedReading } from "../buttons/FinishedReading";
import ReturnToSearch from "../buttons/ReturnToSearch";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import GetInfo from "../buttons/GetInfo";
import { useMemo } from "react";
import { ReadingSliceState } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function ControlPanel({ }) {
    const isMobile = useIsMobile();
    const { status, articles }: ReadingSliceState = useSelector((state: RootState) => state.investigation.read);
    const failedExtraction = useMemo(() => {
        const failed: boolean = (status === 'fulfilled') && (Array.isArray(articles)) && (articles.length === 0);
        return failed;
    }, [status, articles]);

    return (
        <div className="fixed 2xl:left-16 2xl:bottom-16 
        xl:left-4 xl:bottom-10 lg:left-6 lg:bottom-6 w-fit shadow-material
        bottom-0 left-0 right-0 z-30 flex items-start lg:items-center justify-center gap-x-4 lg:gap-x-0
         lg:shadow-black py-1 md:py-0 px-4 lg:px-0 md:px-0 mx-auto lg:mx-0
        h-14 lg:h-auto bg-zinc-900 xl:bg-astro_black rounded-t-2xl lg:rounded-full pointer-events-auto
         md:border border-border_gray">


            <ReturnToSearch failed={failedExtraction} />


            <FinishedReading failedExtraction={failedExtraction} />


            {!isMobile && <GetInfo failedExtraction={failedExtraction} />}


            <TakeNotes failedExtraction={failedExtraction} />


        </div>
    )


}



