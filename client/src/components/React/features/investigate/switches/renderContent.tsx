import type { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { motion } from "framer-motion";
import SearchResults from "../phase2/results/containers/SearchResults";
import ArticleContainer from "@/components/React/global/Articles/containers/ArticleContainer";
import ScrolltoTop from "@/helpers/ScrollToTop";
import { articleContent } from "@/motion/variants";

export const renderContent = (phase: Phase): JSX.Element | null => {

    switch (phase) {
        case "Phase 2":
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

        case "Phase 3":
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