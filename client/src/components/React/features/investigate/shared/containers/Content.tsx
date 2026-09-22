import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import type { ModalStages } from "@/state/Reducers/Investigate/wiki/WikiSlice";
import type { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { renderContent } from "../../switches/renderContent";

export default function Content() {
    const phase: UserResearchType["phase"] = useSelector((s: RootState) => s.investigation.research.research.phase);
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
                ${((phase === 'searching') || (phase === 'evidence')) ? 'min-h-screen' : ''}
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

