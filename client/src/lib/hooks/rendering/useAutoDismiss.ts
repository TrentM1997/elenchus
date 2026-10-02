import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/state/store";
import { renderGuideTip } from "@/state/Reducers/Overlay/PipelineSlice";

type UseMaxSelectedToast = { count: number; limit?: number; timeout?: number };

export function useMaxSelectedToast({
  count,
  limit = 3,
  timeout = 3000,
}: UseMaxSelectedToast): void {
  const guideTip = useSelector((s: RootState) => s.overlay.guideTip);

  const dispatch = useDispatch<AppDispatch>();
  const prevCountRef = useRef<number>(0);

  useEffect(() => {
    const prev = prevCountRef.current;

    const justReachedLimit: boolean = prev < limit && count === limit;

    if (justReachedLimit) dispatch(renderGuideTip("Max Toast"));

    prevCountRef.current = count;
  }, [count, dispatch]);

  useEffect(() => {
    if (guideTip === null) return;
    const timer = window.setTimeout(() => {
      dispatch(renderGuideTip(null));
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [guideTip, dispatch]);
}
