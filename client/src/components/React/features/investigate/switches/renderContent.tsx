import type { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { motion } from "framer-motion";
import SearchResults from "../phase2/results/containers/SearchResults";
import ArticleContainer from "@/components/React/global/Articles/containers/ArticleContainer";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import { articleContent } from "@/motion/variants";

export const renderContent = (phase: UserResearchType["phase"]): JSX.Element | null => {

    switch (phase) {
        case "searching":
            return (
                <motion.div
                    key='links'
                    variants={articleContent}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full min-h-screen mx-auto relative"
                >
                    <SearchResults />

                </motion.div>
            );

        case "evidence":
            return (
                <motion.div
                    key='articles'
                    variants={articleContent}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="min-h-screen w-full mx-auto px-2"
                >
                    <ArticleContainer />
                </motion.div>
            );

        default: {
            return null;
        }
    }

}
