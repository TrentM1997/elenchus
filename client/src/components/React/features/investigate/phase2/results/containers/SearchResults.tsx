import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useEffect, useMemo } from "react";
import { getPages } from "@/ReduxToolKit/Reducers/Investigate/SearchResults";
import { formPages } from "@/helpers/Presentation";
import Pages from "./Pages";
import SearchFailed from "../errors/SearchFailed";
import { searchResultsVariants } from "@/motion/variants";
import ResultsPending from "../pending/ResultsPending";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import { useMinTimeVisible } from "@/hooks/useMinTimeVisible";
import SelectLinks from "../components/selection/SelectLinks";

export default function SearchResults() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation)
    const { search } = investigateState
    const { articleOptions, status } = search
    const dispatch = useDispatch();
    const visible = useMinTimeVisible((status === 'pending'), 150, 800);
    const renderFallback = useMemo((): boolean => {
        const loaded = (status === 'fulfilled') || (!articleOptions);
        const empty = (Array.isArray(articleOptions)) && (articleOptions.length === 0);
        return (loaded && empty);
    }, [status, articleOptions]);

    const renderPending = useMemo(() => {
        const isPending = (status === 'pending');
        const empty = (!articleOptions);
        return (empty && isPending);
    }, [status, articleOptions]);

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
                className="h-full w-full flex flex-col justify-start items-center mx-auto relative"
            >

                <AnimatePresence mode="wait"
                >
                    {visible && <ResultsPending key={'loading search results'} />}


                    {!renderPending && (!visible) &&
                        <Pages key={'pages'} />
                    }

                </AnimatePresence>

                {renderFallback &&
                    <SearchFailed key="no-results" />
                }
            </div>

            <SelectLinks />
        </motion.div>


    )
};