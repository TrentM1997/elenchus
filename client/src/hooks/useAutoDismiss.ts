import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/ReduxToolKit/store";
import { openMaxtoast } from "@/ReduxToolKit/Reducers/Investigate/ChosenArticles";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";

type UseMaxSelectedToast = { count: number, limit?: number, timeout?: number };

export function useMaxSelectedToast({ count, limit = 3, timeout = 4000 }: UseMaxSelectedToast): void {
    const investigation: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { showMaxToast } = investigation.getArticle;
    const dispatch = useDispatch<AppDispatch>();
    const prevCountRef = useRef<number | null>(null);

    useEffect(() => {
        const prev = prevCountRef.current;
        if (prev === null) {
            prevCountRef.current = count;
        }
        const justReachedLimit: boolean = prev < limit && (count === limit);

        if (justReachedLimit) dispatch(openMaxtoast(true));

        prevCountRef.current = count;

    }, [count, dispatch]);

    useEffect(() => {
        if (!showMaxToast) return;
        const timer = window.setTimeout(() => {
            dispatch(openMaxtoast(false));

        }, timeout);

        return () => {
            clearTimeout(timer);
        };
    }, [showMaxToast, dispatch]);

};