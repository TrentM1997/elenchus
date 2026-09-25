import { useCallback, useRef } from "react";
import type { VirtuosoScrollPos } from "@/state/Reducers/Dashboard/types";

type Position = Extract<VirtuosoScrollPos, { status: "ready" }>["position"];
type ScrollID = "articles" | "investigations";

export const useListScrollPosition = (itemCount: number, scrollerId: ScrollID) => {
  const topIndexRef = useRef<number | null>(null);
  const topKeyRef = useRef<string | number | null>(null);
  const scrollRef = useRef<HTMLElement | Window | null>(null);

  const getScrollSnapshot = useCallback((): Position => {
    const scroller = scrollRef.current;
    return {
      listID: scrollerId,
      dataVersion: itemCount,
      topIndex: topIndexRef.current ?? 0,
      topKey: topKeyRef.current,
      scrollTop: scroller == null ? null
        : "scrollTop" in scroller ? scroller.scrollTop : scroller.scrollY,
      viewportHeight: scroller == null ? null
        : "clientHeight" in scroller ? scroller.clientHeight : scroller.innerHeight,
      savedAt: Date.now(),
    };
  }, [scrollerId, itemCount]);

  return { scrollRef, topKeyRef, topIndexRef, getScrollSnapshot };
};
