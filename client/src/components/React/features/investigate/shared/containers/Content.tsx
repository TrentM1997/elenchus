import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import type { ModalStages } from "@/ReduxToolKit/Reducers/Investigate/WikipediaSlice";
import { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { renderContent } from "../../switches/renderContent";

export default function Content() {
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const wikiModalStages: ModalStages = useSelector((state: RootState) => state.investigation.wiki);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={`${wikiModalStages.highlight
                && 'cursor-text'
                }
                relative shrink-0 w-full h-full min-h-screen 
                mx-auto xs:px-2`}
        >
            <div
                className="relative w-full min-h-full flex flex-col justify-center box-border mx-auto">
                <AnimatePresence mode="wait">
                    {renderContent(phase)}
                </AnimatePresence>
            </div>
        </motion.div>

    )
}
