import { useDispatch, useSelector } from "react-redux";
import { initiateFinalProcess } from "@/ReduxToolKit/Reducers/Investigate/Review";
import { displayArticleContent, displayReadingTooltip, displayWrapUp } from "@/ReduxToolKit/Reducers/Investigate/DisplayReducer";
import GuideDoneReading from "../../shared/tooltips/GuideDoneReading";
import { RootState } from "@/ReduxToolKit/store";
import { useEffect } from "react";
import { useTooltipFlags } from "@/hooks/useTooltipFlags";
import PanelLabel from "./PanelLabel";
import { changePhase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";


export function FinishedReading({ failedExtraction }) {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { showReadingTooltip } = investigateState.display
    const { summaries } = investigateState.read;
    const { getFlags, setFlag } = useTooltipFlags();
    const dispatch = useDispatch()

    useEffect(() => {

        if (summaries && summaries.length < 1) {
            dispatch(displayReadingTooltip(false))
            return;
        };

        const flags = getFlags();

        if (flags.readingTooltip === false) {
            dispatch(displayReadingTooltip(true));
            setFlag('readingTooltip', true);
        };

    }, [getFlags, setFlag, dispatch]);

    return (
        <div className={`${failedExtraction ? 'pointer-events-none opacity-30' : 'pointer-events-auto opacity-100 lg:hover:bg-border_gray'}
            shrink-0 w-fit h-10 lg:h-auto px-2 md:py-1.5 xl:px-2 2xl:px-2.5 relative
              transition-opacity ease-in-out flex justify-center lg:border-r 
              border-border_gray`}>
            <button
                onClick={() => {
                    dispatch(changePhase('Phase 4'));
                }}
                className="my-auto mx-auto rounded-lg transition-all 
        duration-300 max-w-8 max-h-8 xl:max-w-7 xl:max-h-7 2xl:max-w-8 group
        2xl:max-h-8 ease-in-out group relative">


                {showReadingTooltip && <GuideDoneReading />}
                {!showReadingTooltip && <div className="absolute p-1 bg-white z-50 opacity-0 transition-opacity delay-500 duration-200 ease-soft md:group-hover:opacity-100 bottom-[3.3rem] -left-5
            rounded-md items-center border border-astro_gray shadow-thick after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 
            after:transform after:-translate-x-1/2 after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0 
            after:border-t-white after:border-l-transparent after:border-r-transparent after:border-b-transparent">
                    <p className="text-black" >Done Reading</p>
                </div>}
                <div className="h-full w-full box-border">
                    <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="currentColor"
                        className="text-blue-400 lg:group-hover:scale-125 transition-all ease-soft duration-200 icon icon-tabler icons-tabler-filled icon-tabler-circle-check">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                    </svg>

                </div>
            </button>
            <PanelLabel description={"done"} />
        </div>

    );
}
