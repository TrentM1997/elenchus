import { useDispatch, useSelector } from "react-redux";
import GuideDoneReading from "../tooltips/GuideDoneReading";
import { RootState } from "@/ReduxToolKit/store";
import { useEffect, useRef } from "react";
import { useTooltipFlags } from "@/hooks/useTooltipFlags";
import PanelLabel from "./PanelLabel";
import { changePhase, populateTooltip, TooltipDisplayed } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { AnimatePresence } from "framer-motion";
import { smoothScrollUp } from "@/helpers/ScrollToTop";
import { wait } from "@/helpers/Presentation";

export function FinishedReading({ failedExtraction }) {
    const articles: Article[] = useSelector((s: RootState) => s.investigation.read.articles);
    const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
    const { getFlags, setFlag } = useTooltipFlags();
    const dispatch = useDispatch();
    const animateTooltip: boolean = ((Array.isArray(articles) && (articles.length > 0)) && (tooltip === 'Finished Reading Button'));
    const flagTimer = useRef<number | null>(null);

    useEffect(() => {

        if ((!Array.isArray(articles) || (articles.length === 0))) {
            return;
        };

        const flags = getFlags();

        if (flags.readingTooltip === false) {
            flagTimer.current = window.setTimeout(() => {
                dispatch(populateTooltip('Finished Reading Button'));
                setFlag('readingTooltip', true);
                flagTimer.current = null;
            }, 2000);
        };

    }, [getFlags, setFlag, dispatch]);


    const handleClick = async (): Promise<void> => {
        smoothScrollUp();
        await wait(500);
        dispatch(changePhase('Phase 4'));
    };


    return (
        <div className={`${failedExtraction ? 'pointer-events-none opacity-30' : 'pointer-events-auto opacity-100 lg:hover:bg-border_gray/40'}
            shrink-0 w-fit h-10 lg:h-auto px-2 md:py-1.5 xl:px-2 2xl:px-2.5 relative
              transition-all ease-soft duration-300 flex justify-center lg:border-r group cursor-pointer
              border-border_gray`}>
            <AnimatePresence>
                {animateTooltip && <GuideDoneReading />}
            </AnimatePresence>
            <button
                onClick={handleClick}
                className="my-auto mx-auto rounded-lg transition-all 
        duration-300 max-w-8 max-h-8 xl:max-w-7 xl:max-h-7 2xl:max-w-8 group
        2xl:max-h-8 ease-in-out group relative">


                {(tooltip === null) && <div className="absolute pointer-events-none p-1 bg-white z-50 opacity-0 transition-opacity delay-1000 duration-200 ease-soft md:group-hover:opacity-100 bottom-[3.3rem] -left-5
            rounded-md items-center border border-astro_gray shadow-thick after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 
            after:transform after:-translate-x-1/2 after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0 
            after:border-t-white after:border-l-transparent after:border-r-transparent after:border-b-transparent">
                    <p className="text-black" >Done Reading</p>
                </div>}
                <div className="h-full w-full box-border">
                    <ForwardArrow />
                </div>
            </button>
            <PanelLabel description={"done"} />
        </div>
    );
}





function ForwardArrow(): JSX.Element {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="currentColor"
            className="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-right
        text-button_blue/90 delay-200 lg:group-hover:scale-125 lg:group-hover:text-button_blue transition-all ease-soft duration-300"
        ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l.324 .005a10 10 0 1 1 -.648 0l.324 -.005zm.613 5.21a1 1 0 0 0 -1.32 1.497l2.291 2.293h-5.584l-.117 .007a1 1 0 0 0 .117 1.993h5.584l-2.291 2.293l-.083 .094a1 1 0 0 0 1.497 1.32l4 -4l.073 -.082l.064 -.089l.062 -.113l.044 -.11l.03 -.112l.017 -.126l.003 -.075l-.007 -.118l-.029 -.148l-.035 -.105l-.054 -.113l-.071 -.111a1.008 1.008 0 0 0 -.097 -.112l-4 -4z" /></svg>

    )
}




//function CheckMark(): JSX.Element {
//
//    return (
//        <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="currentColor"
//            className="text-button_blue delay-200 lg:group-hover:scale-125 transition-all ease-soft duration-200 icon icon-tabler icons-tabler-filled icon-tabler-circle-check">
//            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//            <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
//        </svg>
//    )
//};