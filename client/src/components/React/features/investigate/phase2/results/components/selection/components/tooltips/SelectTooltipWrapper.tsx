import { AnimatePresence } from "framer-motion";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState } from "@/ReduxToolKit/store";
import SelectionRequired from "../../../../../notifications/SelectionRequired";
import GuideSelectingArticles from "@/components/React/features/investigate/shared/tooltips/GuideSelectingArticles";
import { useEffect, useMemo } from "react";
import { useTooltipFlags } from "@/hooks/useTooltipFlags";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import MaxChosen from "./MaxChosen";
import { useMaxSelectedToast } from "@/hooks/useAutoDismiss";
import { populateTooltip } from "@/ReduxToolKit/Reducers/Investigate/Rendering";

export default function SelectTooltipWrapper(): JSX.Element | null {
    const chosenArticles = useSelector((state: RootState) => state.investigation.getArticle.chosenArticles);
    const showMaxToast = useSelector((state: RootState) => state.investigation.getArticle.showMaxToast);
    const { showSelectWarning, showSelectTooltip, showGetArticlesModal } = useSelector((state: RootState) => state.investigation.display, shallowEqual);
    const showToast = showMaxToast && (!showSelectWarning) && (!showSelectTooltip) && (!showGetArticlesModal);
    const count: number = useMemo(() => {
        if (Array.isArray(chosenArticles)) {
            return chosenArticles.length;
        } else {
            return 0;
        };
    }, [chosenArticles]);
    useMaxSelectedToast({ count });
    const { getFlags, setFlag } = useTooltipFlags();
    const dispatch = useDispatch<AppDispatch>();



    useEffect(() => {
        const flags = getFlags();

        if (flags.selectingTooltip === false) {
            dispatch(populateTooltip('Selection Required'));
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

                {showToast && <MaxChosen key={'max-articles-selected'} />}
            </AnimatePresence>
        </>
    );

};