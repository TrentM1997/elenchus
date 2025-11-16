import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useIsMobile } from "@/hooks/useIsMobile";
import ControlPanel from "../../components/ControlPanel";
import StoryPaginate from "../../buttons/StoryPaginate";
import { ReadingSliceState } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { createPortal } from "react-dom";
import { softEase, variants } from "@/motion/variants";

export default function PanelContainer() {
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const { articles, status }: ReadingSliceState = useSelector((state: RootState) => state.investigation.read);
    const isMobile = useIsMobile();
    const renderControlPanel = (Array.isArray(articles) && (articles.length > 0) || ((status === 'fulfilled')));
    const renderPagination: boolean = ((phase === 'Phase 3') && (Array.isArray(articles)) && (articles.length > 1));

    const container: JSX.Element = (
        <>
            <AnimatePresence>
                {(phase === 'Phase 3') && (renderControlPanel) &&
                    <motion.div
                        variants={variants}
                        initial='closed'
                        animate='open'
                        exit='closed'
                        transition={{ type: 'tween', duration: 0.2, ease: softEase }}
                    >

                        <ControlPanel />
                    </motion.div>}

            </AnimatePresence>
        </>

    );

    return createPortal(container, document.getElementById('portal-root'));
};

{/* {renderPagination && (!isMobile) &&
                    <motion.div
                        variants={variants}
                        initial='closed'
                        animate='open'
                        exit='closed'
                        transition={{ type: 'tween', duration: 0.2, ease: softEase }}

                    >


                        <StoryPaginate />
                    </motion.div>} */}