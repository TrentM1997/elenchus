import { useState, useCallback, useRef, useEffect, useMemo } from "react";

interface ProgressiveListOptions {
  initialCount?: number;
  batchLength?: number;
}

// Disclosure belongs to the mounted list session. Item changes preserve its count;
// remount the list when starting a new session with a different initial count.
export function useProgressiveList<T>(
  items: T[],
  { initialCount = 8, batchLength = 4 }: ProgressiveListOptions = {},
) {
  const [rendered, setRendered] = useState(() => Math.max(0, initialCount));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visible = useMemo(() => items.slice(0, rendered), [items, rendered]);
  const remaining = Math.max(0, items.length - rendered);
  const nextBatchCount = Math.min(Math.max(1, batchLength), remaining);
  const fullyLoaded = remaining === 0;

  const loadMore = useCallback(() => {
    if (timeoutRef.current !== null || nextBatchCount === 0) return;

    timeoutRef.current = setTimeout(() => {
      setRendered(count => Math.min(items.length, count + nextBatchCount));
      timeoutRef.current = null;
    }, 200);
  }, [items.length, nextBatchCount]);

  // A pending batch belongs to the old data/configuration. Cancel it on change
  // as well as unmount, and allow the next endReached event to request a batch.
  useEffect(() => () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, [items, batchLength]);

  return { visible, loadMore, fullyLoaded, nextBatchCount };
}
