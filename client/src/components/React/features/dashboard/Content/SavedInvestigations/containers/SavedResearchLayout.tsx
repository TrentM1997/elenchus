import { RootState } from "@/ReduxToolKit/store"
import { useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import InvestigationsFallback from "../fallbacks/InvestigationsFallback"
import { investigationsVariants } from "@/motion/variants"
import ResearchScroller from "./ResearchScroller"
import { useMemo } from "react"


export interface SavedInvestigation {
    idea: string;
    premises: string | null;
    initial_perspective: string | null;
    biases: string | null;
    ending_perspective: string | null;
    new_concepts: any;
    changed_opinion: any;
    takeaway: string | null;
    had_merit: boolean | null;
    user_id: string;
    sources: string[];
    wikipedia_extracts: any;
    id: number
}

export default function SavedResearchLayout() {
    const savedInvestigations: SavedInvestigation[] = useSelector((state: RootState) => state.userWork.userResearch);
    const timeline = useMemo(() => {
        const populated = Array.isArray(savedInvestigations) && (savedInvestigations.length > 0);
        if (!populated) return null;
        const arr = savedInvestigations.slice();
        const sorted = arr.sort((a: SavedInvestigation, b: SavedInvestigation) => b.id - a.id);
        return sorted;
    }, [savedInvestigations])


    return (
        <motion.section
            key='savedResearch'
            variants={investigationsVariants}
            initial='closed'
            animate='open'
            exit='closed'
            className="w-full">
            <div className="max-h-screen w-full">

                {Array.isArray(timeline) && (timeline.length > 0) ? <div
                    className="mx-auto w-full lg:w-4/5 mt-6 animate-fade-in">
                    <ResearchScroller timeline={timeline} />
                </div>
                    : <InvestigationsFallback />
                }

            </div>
        </motion.section>

    )
}