import { useMemo, useRef } from "react";
import { useScrollTrap } from "@/hooks/useOverScrollTrap";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/ReduxToolKit/hooks/useAppSelector";
import { selectWikiSummary, selectWikiDisambig } from "@/ReduxToolKit/Reducers/Investigate/WikipediaSlice";
import { WikiSummaryResponse, WikiDisambigResponse } from "@/services/wiki/wiki";
import StandardExtract from "./standard/StandardExtract";
import DisambigExtract from "./disambig/DisambigExtract";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import ExtractError from "./errors/ExtractError";

export default function Description(): JSX.Element | null {
    const disambig: WikiDisambigResponse = useAppSelector(selectWikiDisambig);
    const summary: WikiSummaryResponse = useAppSelector(selectWikiSummary);
    const investigate: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { errormessage } = investigate.wiki;
    const scrollRef = useRef(null);
    useScrollTrap(scrollRef);
    const showDisambig = useMemo(() => {
        if (!disambig || (!Array.isArray(disambig.candidates))) return false;
        return (disambig.candidates.length > 0);
    }, [disambig]);


    return (
        <AnimatePresence >
            {(summary) && (summary.description) && (summary.extract)
                && <StandardExtract key={'standard'} />
            }
            {showDisambig && <DisambigExtract key='disambing' />}
            {errormessage && <ExtractError key={'errormessage'} />}
        </AnimatePresence>
    )
};