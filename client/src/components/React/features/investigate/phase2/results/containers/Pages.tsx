import { AnimatePresence, motion } from "framer-motion"
import { useSelector } from "react-redux"
import Page from "./Page"
import { RootState } from "@/ReduxToolKit/store"
import { useMemo } from "react";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";

const variants = {
    show: {
        opacity: 1,
        transition: { type: 'tween', duration: 0.4, ease: 'easeInOut', delay: 0.4 }
    },
    hide: {
        opacity: 0,
        transition: { type: 'tween', duration: 0.4, ease: 'easeInOut' }
    }
};


export default function Pages() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation)
    const { search } = investigateState
    const { currentPage, pages, status } = search;
    const renderLinks = useMemo(() => {
        const canMap = Array.isArray(pages) && (pages.length > 0);
        return canMap
    }, [status, pages]);

    return (
        <motion.div
            key='pagesOfLinks'
            variants={variants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.3, ease: [0.33, 0, 0.67, 1] } }}
            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, ease: [0.65, 0, 0.35, 1] } }}
            className="relative min-h-dvh inset-0 h-full flex flex-col justify-center items-center grow w-full"
        >
            <ErrorBoundary>
                <div className="relative min-h-full grow w-full h-full">
                    <AnimatePresence mode="wait">
                        {renderLinks && (pages[currentPage]) &&
                            <Page
                                key={`page${currentPage}`}
                                pageContent={pages[currentPage]}
                            />
                        }
                    </AnimatePresence>
                </div>
            </ErrorBoundary>



        </motion.div>
    )
}