import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { RootState } from "@/state/store";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import BackToSearchTooltip from "../../tooltips/BackToSearchTooltip";
import PanelLabel from "./PanelLabel";
import ButtonHoverTooltip from "../../tooltips/ButtonHoverTooltip";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { TooltipDisplayed } from "@/state/Reducers/Investigate/Rendering";
import Back from "../../../phase1/components/buttons/Back";

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
        <div className="shrink-0 relative lg:rounded-l-full w-fit h-10 lg:h-auto px-2  md:py-1.5 lg:px-2.5  lg:hover:bg-border_gray/40 transition-all ease-soft duration-200 
        lg:border-r border-border_gray  group cursor-pointer flex justify-center">
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

                {(!showBackTooltip) && <ButtonHoverTooltip description="back to search" />
                }

                <div className="h-full w-full box-border">
                    <BackArrow />
                </div>

            </button>

            <PanelLabel description={"back"} />
        </div>

    )
}


function BackArrow(): JSX.Element {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="currentColor"
            className="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-left text-white lg:group-hover:scale-[1.35]
        lg:group-hover:text-blue-500 transition-all ease-soft duration-300 delay-150  will-change-transform
        "><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2a10 10 0 0 1 .324 19.995l-.324 .005l-.324 -.005a10 10 0 0 1 .324 -19.995zm.707 5.293a1 1 0 0 0 -1.414 0l-4 4a1.048 1.048 0 0 0 -.083 .094l-.064 .092l-.052 .098l-.044 .11l-.03 .112l-.017 .126l-.003 .075l.004 .09l.007 .058l.025 .118l.035 .105l.054 .113l.043 .07l.071 .095l.054 .058l4 4l.094 .083a1 1 0 0 0 1.32 -1.497l-2.292 -2.293h5.585l.117 -.007a1 1 0 0 0 -.117 -1.993h-5.586l2.293 -2.293l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>

    )
};