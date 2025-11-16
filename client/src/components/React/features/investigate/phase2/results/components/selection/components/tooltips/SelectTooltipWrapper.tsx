import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/ReduxToolKit/store";
import SelectionRequired from "../../../../../notifications/SelectionRequired";
import GuideSelectingArticles from "@/components/React/features/investigate/phase2/results/tooltips/GuideSelectingArticles";
import { useEffect, useMemo } from "react";
import { useTooltipFlags } from "@/hooks/useTooltipFlags";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import MaxChosen from "./MaxChosen";
import { useMaxSelectedToast } from "@/hooks/useAutoDismiss";
import { ModalDisplayed, populateTooltip, TooltipDisplayed } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { wait } from "@/helpers/Presentation";
import type { Tooltips } from "@/env";

interface TooltipWrapper {
    flags: Tooltips
};

export default function SelectTooltipWrapper(): JSX.Element | null {
    const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
    const chosenArticles = useSelector((state: RootState) => state.investigation.getArticle.chosenArticles);
    const dispatch = useDispatch<AppDispatch>();
    const { getFlags } = useTooltipFlags();
    const count: number = useMemo(() => {
        if (Array.isArray(chosenArticles)) {
            return chosenArticles.length;
        } else {
            return 0;
        };
    }, [chosenArticles]);
    useMaxSelectedToast({ count });

    const surfaceTooltip = async () => {
        const flags = getFlags();
        if (flags.selectingTooltip === false) {
            await wait(1500);
            dispatch(populateTooltip('Guide Selection'));
        };
    };



    useEffect(() => {

        surfaceTooltip();

    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {(tooltip === 'Selection Required') &&
                    <SelectionRequired key={'minimum-chosen warning'} />
                }

                {(tooltip === 'Guide Selection') &&
                    <GuideSelectingArticles key={'tooltip'}
                    />
                }

                {(tooltip === 'Max Toast') && <MaxChosen key={'max-articles-selected'} />}
            </AnimatePresence>
        </>
    );

};