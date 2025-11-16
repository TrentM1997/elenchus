import { motion, AnimatePresence } from "framer-motion";
import SearchResults from "@/components/React/features/investigate/phase2/results/containers/SearchResults";
import ModalContainer from "@/components/React/features/investigate/shared/wrappers/ModalContainer";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import ScrolltoTop from "@/helpers/ScrollToTop";
import ArticleContainer from "@/components/React/Shared/Articles/containers/ArticleContainer";
import type { ModalStages } from "@/ReduxToolKit/Reducers/Investigate/WikipediaSlice";
import { Phase, TooltipDisplayed } from "@/ReduxToolKit/Reducers/Investigate/Rendering";

export default function Content() {
    const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const wikiModalStages: ModalStages = useSelector((state: RootState) => state.investigation.wiki);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={`
            ${wikiModalStages.highlight && 'cursor-text'}
                relative shrink-0 w-full h-full min-h-screen mx-auto xs:px-2`}>

            <ModalContainer />

            <div
                className="relative w-full min-h-full flex flex-col justify-center box-border mx-auto">
                <AnimatePresence mode="wait">

                    {(phase === 'Phase 2') &&
                        <motion.div
                            key='links'
                            style={{ position: 'relative' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.25, delay: 0.5 } }}
                            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.25, delay: 0 } }}
                            transition={{ type: 'tween', duration: 0.5 }}
                            className="w-full min-h-screen mx-auto lg:pb-96"
                        >
                            <SearchResults />

                        </motion.div>}

                    {(phase === 'Phase 3') &&
                        <motion.div
                            key='articles'
                            style={{ position: 'relative' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: (tooltip === 'Finished Reading Button') ? 0.5 : 1, transition: { type: 'tween', duration: 0.2, delay: 0.3 } }}
                            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, delay: 0 } }}
                            className="min-h-screen w-full mx-auto"
                        >
                            <ArticleContainer />
                            <ScrolltoTop key='scroll' />
                        </motion.div>}
                </AnimatePresence>
            </div>
        </motion.div>

    )
}
