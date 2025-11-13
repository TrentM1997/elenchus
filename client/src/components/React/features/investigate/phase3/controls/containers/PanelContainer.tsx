import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useIsMobile } from "@/hooks/useIsMobile";
import ControlPanel from "../../components/ControlPanel";
import StoryPaginate from "../../buttons/StoryPaginate";
import { ReadingSliceState } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";

export default function PanelContainer() {
    const showContent = useSelector((state: RootState) => state.investigation.display.showContent);
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const { articles, status }: ReadingSliceState = useSelector((state: RootState) => state.investigation.read);
    const isMobile = useIsMobile();
    const renderControlPanel = (Array.isArray(articles) && (articles.length > 0) || ((status === 'fulfilled')));

    return (
        <AnimatePresence>
            {(phase === 'Phase 3') && (renderControlPanel) &&
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'tween', duration: 0.2 }}
                    className="w-full h-auto relative mx-auto"
                >

                    <ControlPanel />
                    {(!isMobile) && (status === 'fulfilled') &&
                        (phase === 'Phase 3') &&
                        Array.isArray(articles) &&
                        (articles.length > 1) &&
                        <StoryPaginate />
                    }
                </motion.div>}
        </AnimatePresence>
    );
};