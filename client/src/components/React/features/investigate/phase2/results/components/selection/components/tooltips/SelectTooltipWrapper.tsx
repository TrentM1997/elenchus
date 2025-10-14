import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/ReduxToolKit/store";
import type { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import SelectionRequired from "../../../../../notifications/SelectionRequired";
import GuideSelectingArticles from "@/components/React/features/investigate/shared/tooltips/GuideSelectingArticles";
import { useEffect, useMemo } from "react";
import { useTooltipFlags } from "@/hooks/useTooltipFlags";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { displaySelectTooltip } from "@/ReduxToolKit/Reducers/Investigate/DisplayReducer";
import MaxChosen from "./MaxChosen";
import { useMaxSelectedToast } from "@/hooks/useAutoDismiss";

export default function SelectTooltipWrapper(): JSX.Element | null {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { display, getArticle } = investigateState;
    const { chosenArticles, showMaxToast } = getArticle;
    const count: number = useMemo(() => {
        if (Array.isArray(chosenArticles)) {
            return chosenArticles.length;
        } else {
            return 0;
        };
    }, [chosenArticles]);
    useMaxSelectedToast({ count });
    const { showSelectTooltip } = display;
    const { showSelectWarning } = investigateState.display;
    const { getFlags, setFlag } = useTooltipFlags();
    const dispatch = useDispatch<AppDispatch>();



    useEffect(() => {
        const flags = getFlags();

        if (flags.selectingTooltip === false) {
            dispatch(displaySelectTooltip(true));
            setFlag('selectingTooltip', true);
        };

    }, [getFlags, setFlag, dispatch]);

    return (
        <>
            <AnimatePresence mode="wait">
                {showSelectWarning &&
                    <SelectionRequired key={'minimum-chosen warning'} />
                }

                {showSelectTooltip &&
                    !showSelectWarning &&
                    <GuideSelectingArticles key={'tooltip'}
                    />
                }

                {showMaxToast && (!showSelectWarning) && (!showSelectTooltip) && <MaxChosen key={'max-articles-selected'} />}
            </AnimatePresence>
        </>
    );

};