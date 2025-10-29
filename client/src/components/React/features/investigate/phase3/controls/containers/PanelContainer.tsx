import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useIsMobile } from "@/hooks/useIsMobile";
import ControlPanel from "../../components/ControlPanel";
import StoryPaginate from "../../buttons/StoryPaginate";
import { ReadingSliceState } from "@/ReduxToolKit/Reducers/Investigate/Reading";

export default function PanelContainer() {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { showContent } = investigateState.display
    const { articles, status, failedNotifications }: ReadingSliceState = investigateState.read
    const isMobile = useIsMobile();
    const renderControlPanel = (Array.isArray(articles) && (articles.length > 0) || ((status === 'fulfilled') && (Array.isArray(failedNotifications)) && (failedNotifications.length > 0)))

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
                    {renderControlPanel &&

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