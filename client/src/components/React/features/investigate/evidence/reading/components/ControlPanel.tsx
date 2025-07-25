import TakeNotes from "../buttons/TakeNotes";
import { FinishedReading } from "../buttons/FinishedReading";
import ReturnToSearch from "../buttons/ReturnToSearch";
import StoryPaginate from "../buttons/StoryPaginate";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import GetInfo from "../buttons/GetInfo";

export default function ControlPanel({ }) {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const showContent = investigateState.display

    return (
        <div className="fixed 2xl:left-16 2xl:bottom-16 xl:left-4 xl:bottom-10 lg:left-6 lg:bottom-6 
        bottom-0 left-0 right-0 z-30 flex lg:w-fit 2xl:w-fit shadow-black
         h-auto bg-black xl:bg-astro_black lg:rounded-full border-t md:border border-border_gray">


            <div className="shrink-0 lg:rounded-l-full w-fit h-auto px-2 py-0.5  md:py-1.5 xl:px-2 2xl:px-2.5  md:hover:bg-border_gray transition-all ease-in-out lg:border-r border-border_gray flex justify-center">
                <ReturnToSearch />
            </div>

            <div className="shrink-0 w-fit h-auto py-0.5 px-2 md:py-1.5 xl:px-2 2xl:px-2.5 md:hover:bg-border_gray transition-all ease-in-out flex justify-center lg:border-r border-border_gray">
                <FinishedReading />
            </div>
            <div className="hidden lg:flex shrink-0 w-fit h-auto px-2.5 xl:px-2.5 md:hover:bg-border_gray transition-all ease-in-out justify-center items-center lg:border-r lg:border-0 border-border_gray">
                <GetInfo />
            </div>
            <div className="shrink-0 w-fit h-auto lg:rounded-r-full px-2.5 py-0.5 xl:px-2.5 md:hover:bg-border_gray transition-all ease-in-out flex justify-center lg:border-0 border-border_gray">
                <TakeNotes />
            </div>
            {showContent && <div className="flex justify-center lg:hidden grow shrink-0 w-fit h-auto py-1.5 xl:px-2 2xl:px-2.5 lg:hover:bg-border_gray transition-all ease-in-out lg:border-0 border-border_gray">
                <StoryPaginate />
            </div>}
        </div>
    )


}



