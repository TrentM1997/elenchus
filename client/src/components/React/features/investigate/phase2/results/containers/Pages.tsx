import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import Page from "./Page"
import { RootState } from "@/ReduxToolKit/store"
import { useMemo } from "react";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import LinkPagination from "../components/buttons/LinkPagination";
import { pagesVariants } from "@/motion/variants";
import ResultsSpacer from "../components/skeletons/ResultsSpacer";
import { useTransitionedIndex } from "@/hooks/useTransitionedIndex";

export default function Pages(): JSX.Element | null {
    const pages = useSelector((state: RootState) => state.investigation.search.pages);
    const status = useSelector((state: RootState) => state.investigation.search.status);
    const articleOptions = useSelector((state: RootState) => state.investigation.search.articleOptions);
    const { isPending, displayed } = useTransitionedIndex({});
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
            initial={false}
            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.3, ease: [0.33, 0, 0.67, 1] } }}
            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, ease: [0.65, 0, 0.35, 1] } }}
            className="relative min-h-dvh inset-0 h-full flex flex-col justify-center items-center grow w-full"
        >

            <ErrorBoundary>

                {renderPagination ? (<LinkPagination disabled={isPending} />) : <ResultsSpacer />}

                <div className="relative min-h-full grow w-full h-full">
                    {renderLinks && (pages[displayed]) &&
                        <Page
                            key={`page${displayed}`}
                            index={displayed}
                        />
                    }
                </div>
            </ErrorBoundary>

        </motion.div>
    );
};
