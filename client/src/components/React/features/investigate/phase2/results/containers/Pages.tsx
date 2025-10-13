import { AnimatePresence, motion } from "framer-motion"
import { useSelector } from "react-redux"
import Page from "./Page"
import { RootState } from "@/ReduxToolKit/store"
import { useMemo } from "react";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import LinkPagination from "../components/buttons/LinkPagination";
import { pagesVariants } from "@/motion/variants";



export default function Pages() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation)
    const { search } = investigateState
    const { currentPage, pages, status, articleOptions } = search;
    const renderLinks = useMemo(() => {
        const canMap = Array.isArray(pages) && (pages.length > 0);
        return canMap
    }, [status, pages]);

    const renderPagination = useMemo(() => {
        const hasPages = ((Array.isArray(articleOptions)) && (Array.isArray(pages)) && (pages.length > 1));
        return (hasPages);
    }, [pages, status]);

    return (
        <motion.div
            key='pagesOfLinks'
            variants={pagesVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.3, ease: [0.33, 0, 0.67, 1] } }}
            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, ease: [0.65, 0, 0.35, 1] } }}
            className="relative min-h-dvh inset-0 h-full flex flex-col gap-y-4 justify-center items-center grow w-full"
        >

            <ErrorBoundary>

                <AnimatePresence>
                    {renderPagination && (<LinkPagination />)}
                </AnimatePresence>

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