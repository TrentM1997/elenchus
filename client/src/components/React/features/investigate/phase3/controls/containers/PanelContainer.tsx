import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useIsMobile } from "@/hooks/useIsMobile";
import ControlPanel from "../../components/ControlPanel";
import StoryPaginate from "../../buttons/StoryPaginate";

export default function PanelContainer() {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { showContent } = investigateState.display
    const { articles, status } = investigateState.read
    const isMobile = useIsMobile();

    return (
        <AnimatePresence>
            {showContent &&
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'tween', duration: 0.2 }}
                    className="w-full h-auto relative mx-auto"
                >
                    {showContent &&
                        (Array.isArray(articles) && (articles.length > 0)) &&
                        <ControlPanel />
                    }
                    {(!isMobile) && (status === 'fulfilled') &&
                        showContent &&
                        Array.isArray(articles) &&
                        (articles.length > 1) &&
                        <StoryPaginate />
                    }
                </motion.div>}
        </AnimatePresence>
    );
};