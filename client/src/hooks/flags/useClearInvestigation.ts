import { useEffect } from "react";
import type { TooltipDisplayed } from "@/state/Reducers/Investigate/Rendering";
import { populateTooltip } from "@/state/Reducers/Investigate/Rendering";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import { useTooltipFlags } from "../useTooltipFlags";
import { CLEAR_INVESTIGATION } from "@/state/Reducers/Root/InvestigateReducer";

export const PLAYSTATE_KEYS = [
    'previous-biases',
    'previous-perspective',
    'previous-expertise',
];


export function clearCachedPlayStates(keys: Array<string>) {
    try {
        for (const k of keys) {
            sessionStorage.removeItem(k)

        }
    } catch (err) {
        console.error(err);
    }
};


type ReturnTooltipFunction = (tooltip: TooltipDisplayed) => Promise<void>

interface ClearInvestigationReturnType {
    removeTooltip: ReturnTooltipFunction
}


const useClearInvestigation = (): ClearInvestigationReturnType => {
    const { setFlag } = useTooltipFlags();
    const dispatch = useDispatch<AppDispatch>();


    async function removeToolTip(tooltip: TooltipDisplayed) {
        if (tooltip === 'Guide Selection') {
            setFlag('selectingTooltip', true);
            dispatch(populateTooltip(null))

        } else if (tooltip === 'Finished Reading Button') {
            setFlag('readingTooltip', true);
            dispatch(populateTooltip(null))
        }
    };

    useEffect(() => {

        return () => {
            clearCachedPlayStates(PLAYSTATE_KEYS);
            dispatch({ type: CLEAR_INVESTIGATION });
        }
    }, []);

    return { removeTooltip: removeToolTip };
};


export { useClearInvestigation };