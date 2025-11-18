import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/ReduxToolKit/store";
import { populateTooltip } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import type { TooltipDisplayed } from "@/ReduxToolKit/Reducers/Investigate/Rendering";

type UseMaxSelectedToast = { count: number, limit?: number, timeout?: number };

export function useMaxSelectedToast({ count, limit = 3, timeout = 3000 }: UseMaxSelectedToast): void {
    const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
    const dispatch = useDispatch<AppDispatch>();
    const prevCountRef = useRef<number | null>(null);

    useEffect(() => {

        const prev = prevCountRef.current;

        const justReachedLimit: boolean = prev < limit && (count === limit);

        if (justReachedLimit) dispatch(populateTooltip('Max Toast'));

        prevCountRef.current = count;

    }, [count, dispatch]);

    useEffect(() => {
        if (tooltip === null) return;
        const timer = window.setTimeout(() => {
            dispatch(populateTooltip(null));

        }, timeout);

        return () => {
            clearTimeout(timer);
        };
    }, [tooltip, dispatch]);

};