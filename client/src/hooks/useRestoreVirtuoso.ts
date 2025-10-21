import type { RootState, AppDispatch } from "@/ReduxToolKit/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

interface RestoreVirtuoso<T> {
    dataWindow: T[],
    endReached: boolean | null,
    topIndex: number | null
};

export function useRestoreVirtuoso<T>(visible: T[] | null, topIndex?: number, triggered?: boolean): RestoreVirtuoso<T> | null {
    const storedValues = null;

    useEffect(() => {
        if (!triggered) return;


    }, [triggered]);


    return;
};