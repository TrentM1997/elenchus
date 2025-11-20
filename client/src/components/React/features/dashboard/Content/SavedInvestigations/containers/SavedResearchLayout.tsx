import { RootState } from "@/ReduxToolKit/store"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import InvestigationsFallback from "../fallbacks/InvestigationsFallback"
import { investigationsVariants } from "@/motion/variants"
import ResearchScroller from "./ResearchScroller"


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

    return (
        <motion.section
            key='savedResearch'
            variants={investigationsVariants}
            initial='closed'
            animate='open'
            exit='closed'
            className="w-full">
            <div className="max-h-screen w-full">

                {Array.isArray(savedInvestigations) && (savedInvestigations.length > 0) ? <div
                    className="mx-auto w-full lg:w-4/5 mt-6 animate-fade-in">
                    <ResearchScroller timeline={savedInvestigations} />
                </div>
                    : <InvestigationsFallback />
                }

            </div>
        </motion.section>

    )
}