import { clearScrollPosition, storeResearchScrollPosition, storeScrollPosition, VirtuosoScrollPos } from "@/state/Reducers/UserContent/ProfileNavigationSlice";
import { AppDispatch } from "@/state/store";
import React, { useState, useCallback, useRef, useEffect, useMemo, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import type { VirtuosoHandle } from "react-virtuoso";
import type { MutableRefObject } from "react";

type LoadMore = () => void;

interface VirtuosoHook<T> {
    fullyLoaded: boolean,
    visible: T[],
    loadMore: LoadMore,
    numSkeletons: number | null,
    saveNow?: () => void,
    topIndexRef?: MutableRefObject<number>,
    topKeyRef?: MutableRefObject<number>,
    scrollRef?: MutableRefObject<HTMLDivElement>,
    initialTopMostItemIndex?: number | null

};

type ScrollID = 'articles' | 'investigations';

type RestoreScrollToken = VirtuosoScrollPos | null;


export function useVirtuoso<T>(items: T[], scrollerId?: ScrollID, restoreToken?: RestoreScrollToken, topKey?: string | number, batchLength?: number,): VirtuosoHook<T> {
    const didSaveRef = useRef(false);
    const restoreInfo = useMemo(() => {
        if (!restoreToken || restoreToken.listID !== scrollerId || didSaveRef.current) return null;


        const idxFromKey =
            restoreToken.topKey != null
                ? (items as any[]).findIndex(i => i.id === restoreToken.topKey)
                : -1;

        const targetIndex =
            idxFromKey >= 0
                ? idxFromKey
                : Math.max(0, Math.min(restoreToken.topIndex ?? 0, items.length - 1));

        const safePixel =
            restoreToken.dataVersion === items.length &&
            restoreToken.scrollTop != null;


        return {
            targetIndex,
            safePixel,
            scrollTop: restoreToken.scrollTop ?? null,
            tokenStamp: restoreToken.scrollTop ?? 0,
        };
    }, [restoreToken?.savedAt, restoreToken?.listID, restoreToken?.topKey, restoreToken?.topIndex, restoreToken?.dataVersion, restoreToken?.scrollTop, scrollerId, items]);

    const topIndexRef = useRef<number | null>(null);
    const topKeyRef = useRef<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const buffer = 10;
    const [rendered, setRendered] = useState<number>(() => {
        if (!restoreInfo) return 8;
        return Math.max(8, restoreInfo.targetIndex + buffer + 1);
    });
    const initialTopMostItemIndex = restoreInfo ? (restoreInfo?.targetIndex + 1) : null;
    const [fullyLoaded, setFullyLoaded] = useState<boolean>(false);
    const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingTimeoutRef = useRef<boolean>(false);
    const visible = useMemo(() => items.slice(0, rendered), [items, rendered]);
    const dispatch = useDispatch<AppDispatch>();

    const nextBatchLength: number = batchLength ?? 4;
    const remainingItems: number = items.length - rendered;
    const next: number = Math.min(nextBatchLength, remainingItems);
    const numSkeletons = useMemo(() => {

        return Math.min(nextBatchLength, remainingItems);
    }, [remainingItems, batchLength, restoreInfo]);



    const saveNow = useCallback(() => {
        if (didSaveRef.current) return;
        didSaveRef.current = true;
        if (scrollerId === 'articles') {
            dispatch(storeScrollPosition({
                listID: scrollerId,
                dataVersion: items.length,
                topIndex: topIndexRef.current ?? 0,
                topKey: topKeyRef.current ?? null,
                scrollTop: scrollRef.current?.scrollTop ?? null,
                viewportHeight: scrollRef.current?.clientHeight ?? null,
                savedAt: Date.now(),
            }));
        } else {
            dispatch(storeResearchScrollPosition({
                listID: scrollerId,
                dataVersion: items.length,
                topIndex: topIndexRef.current ?? 0,
                topKey: topKeyRef.current ?? null,
                scrollTop: scrollRef.current?.scrollTop ?? null,
                viewportHeight: scrollRef.current?.clientHeight ?? null,
                savedAt: Date.now(),
            }))
        }

    }, [dispatch, scrollerId, items.length]);

    const loadMore: LoadMore = useCallback(() => {
        if (pendingTimeoutRef.current) return;
        if (fullyLoaded) return;
        if (rendered >= items.length) return;

        pendingTimeoutRef.current = true;



        timeRef.current = setTimeout((): void => {
            setRendered((rendered) => {
                const nextRender = rendered + next;
                if (nextRender >= items.length) {
                    setFullyLoaded(true);
                }
                return nextRender
            });

            pendingTimeoutRef.current = false;
            timeRef.current = null;

        }, 200);
    }, [items.length, nextBatchLength, rendered, fullyLoaded]);


    useEffect(() => {

        return () => {
            if (timeRef.current) clearTimeout(timeRef.current);
            pendingTimeoutRef.current = false;
        }
    }, []);


    return { fullyLoaded, visible, loadMore, numSkeletons, scrollRef, topKeyRef, topIndexRef, saveNow, initialTopMostItemIndex };
};