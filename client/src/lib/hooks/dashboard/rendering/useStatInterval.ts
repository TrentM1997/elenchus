import { useEffect, useRef, useState } from "react";

export const useStatInterval = (target: number) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted.current) {
        hasStarted.current = true;
        let current = 0;
        const interval = setInterval(() => {
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
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [target]);

  return {
    count,
    ref,
  };
};
