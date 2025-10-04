import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import { AppDispatch, type RootState } from "@/ReduxToolKit/store";
import { denyIncrement } from "@/ReduxToolKit/Reducers/Investigate/Steps";

export function useCheckFirstStep() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
    const selected = useSelector((state: RootState) => state.bluesky.selected);
    const dispatch = useDispatch<AppDispatch>();
    const { idea } = investigateState.pov;
    const timeRef = useRef<number | null>(null);
    const min: number = 4;


    const wordCount = (statement: string): number => {
        const trimmed: string[] = statement.trim().split(' ')
        return trimmed.length;
    };


    const check = useCallback((): void => {

        timeRef.current = window.setTimeout(() => {

            const count = wordCount(idea);
            const passes = (count >= min);
            dispatch(denyIncrement(!passes));

            timeRef.current = null;
        }, 300);

    }, [idea]);

    useLayoutEffect(() => {
        if (idea === '' || idea === null) {
            dispatch(denyIncrement(null));
            return;
        };

        check();

        return () => {
            if (timeRef.current !== null) {
                clearTimeout(timeRef.current);
            };
        }

    }, [selected, idea]);



};