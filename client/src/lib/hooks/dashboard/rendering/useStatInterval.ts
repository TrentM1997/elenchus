import { useEffect, useRef, useState } from "react";

export const useStatInterval = (target: number) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let hasStarted = false;
    let disposed = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!disposed && entry?.isIntersecting && !hasStarted) {
        hasStarted = true;
        let current = 0;
        interval = setInterval(() => {
          if (current < target) {
            current += 1;
            setCount(current);
          } else {
            clearInterval(interval);
          }
        }, 50);
      }
    });

    if (ref.current) observer.observe(ref.current);

    return () => {
      disposed = true;
      observer.disconnect();
      if (interval !== undefined) clearInterval(interval);
    };
  }, [target]);

  return {
    count,
    ref,
  };
};
