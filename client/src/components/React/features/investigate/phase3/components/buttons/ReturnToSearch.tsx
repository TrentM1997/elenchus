import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import BackToSearchTooltip from "../../tooltips/BackToSearchTooltip";
import PanelLabel from "./PanelLabel";
import ButtonHoverTooltip from "../../tooltips/ButtonHoverTooltip";
import { renderModal } from "@/ReduxToolKit/Reducers/RenderingPipelines/PipelineSlice";
import { TooltipDisplayed } from "@/ReduxToolKit/Reducers/Investigate/Rendering";

interface ReturnToSearchProps {
    failed: boolean
};

export type TooltipType = 'failed' | 'service-down';

export default function ReturnToSearch({ failed }: ReturnToSearchProps): JSX.Element | null {
    const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
    const [showBackTooltip, setShowBackTooltip] = useState<TooltipType | null>(null);
    const dispatch = useDispatch();


    const handleReturn = () => {
        dispatch(renderModal('Back to Search'));
    };

    useEffect(() => {
        if (!failed) return;

        const TOASTKEY = 'extraction-toast:v1';
        try {
            const toast = window.sessionStorage.getItem(TOASTKEY) ?? null;
            setShowBackTooltip(toast ? 'service-down' : 'failed');
        } catch {
            setShowBackTooltip('failed');
        };

    }, [failed]);



    return (
        <div className="shrink-0 relative lg:rounded-l-full w-fit h-10 lg:h-auto px-2  md:py-1.5 lg:px-2.5  lg:hover:bg-border_gray transition-colors ease-soft duration-200 
        lg:border-r border-border_gray flex justify-center">
            <button
                aria-label="Return to search"
                onClick={handleReturn}
                className="my-auto mx-auto rounded-lg transition-all group
        duration-300 xs:max-w-8 xs:max-h-8 xl:max-w-7 xl:max-h-7 2xl:max-w-8 
        2xl:max-h-8 lg:p-0.5 ease-in-out group relative"
            >
                <AnimatePresence>
                    {showBackTooltip && <BackToSearchTooltip id={showBackTooltip} setShowBackTooltip={setShowBackTooltip} />}
                </AnimatePresence>

                {(!showBackTooltip) && <ButtonHoverTooltip description="Return to search" />
                }

                <div className="h-full w-full box-border">
                    <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                        className="text-white group-hover:text-blue-400 transition-colors duration-200 ease-soft icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>
                </div>


            </button>

            <PanelLabel description={"back"} />
        </div>

    )
}