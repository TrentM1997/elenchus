import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useEffect, useMemo } from "react";
import { getPages, incrementPageBy } from "@/ReduxToolKit/Reducers/Investigate/SearchResults";
import { formPages } from "@/helpers/Presentation";
import LinkPagination from "../components/buttons/LinkPagination";
import Pages from "./Pages";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import SearchFailed from "../errors/SearchFailed";
import { searchResultsVariants } from "@/motion/variants";
import ResultsPending from "../pending/ResultsPending";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";

export default function SearchResults() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation)
    const { search } = investigateState
    const { articleOptions, status, pages } = search
    const dispatch = useDispatch();
    const renderFallback = useMemo((): boolean => {
        const loaded = (status === 'fulfilled') || (!articleOptions);
        const empty = (Array.isArray(articleOptions)) && (articleOptions.length === 0);
        return (loaded && empty);
    }, [status, articleOptions]);

    const renderPagination = useMemo(() => {
        const hasPages = ((Array.isArray(articleOptions)) && (Array.isArray(pages)) && (pages.length > 1));
        const hasLoaded = status === 'fulfilled';
        return (hasPages && hasLoaded);
    }, [pages, status]);

    useEffect(() => {

        if (status === 'fulfilled' && articleOptions) {
            const formedPages = formPages(articleOptions)
            dispatch(getPages(formedPages))
        };


    }, [status, articleOptions]);



    return (
        <motion.div
            key='linkGridContainer'
            variants={searchResultsVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.2 }}
            className="h-full w-full min-h-screen grow pt-4 mb-44 md:mb-0"
        >
            <div
                className="h-full w-full flex flex-col gap-y-4 justify-start items-center mx-auto relative"
            >
                <AnimatePresence>
                    {renderPagination && <LinkPagination key={'linkPagination'} />}

                </AnimatePresence>

                <AnimatePresence mode="wait"
                >


                    {status === 'pending' && <ResultsPending key={'loading search results'} />}


                    {status === 'fulfilled' &&
                        <Pages key={'pages'} />
                    }

                </AnimatePresence>

                {renderFallback &&
                    <SearchFailed key="no-results" />
                }
            </div>
        </motion.div>


    )
};