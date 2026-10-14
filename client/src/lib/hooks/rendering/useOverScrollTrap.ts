import { useEffect } from "react";

export function useScrollTrap(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const delta = e.deltaY;
      const atTop = scrollTop === 0 && delta < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight && delta > 0;
      if (atTop || atBottom) e.preventDefault();
    };

    let startY = 0;
    function onTouchStart(e: TouchEvent) {
      const start = e.touches[0];
      if (start) {
        startY = start.clientY;
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const delta = touch.clientY - startY;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0 && delta > 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight && delta < 0;
      if (atTop || atBottom) e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [ref]);
}
