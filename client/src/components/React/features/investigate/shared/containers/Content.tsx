import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import type { ModalStages } from "@/ReduxToolKit/Reducers/Investigate/WikipediaSlice";
import { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { renderContent } from "../../switches/renderContent";

export default function Content() {
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const wikiModalStages: ModalStages = useSelector((state: RootState) => state.investigation.wiki.wikiModalStages);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={`${wikiModalStages.highlight
                && 'cursor-text'
                }
                ${((phase === 'Phase 2') || (phase === 'Phase 3')) ? 'min-h-screen' : ''}
                relative w-full h-full
                mx-auto`}
        >
            <div
                className="relative w-full min-h-full box-border">
                <AnimatePresence mode="wait">
                    {renderContent(phase)}
                </AnimatePresence>
            </div>
        </motion.div>

    )
}
