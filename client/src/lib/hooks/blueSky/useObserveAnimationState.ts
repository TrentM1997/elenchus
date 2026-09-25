import { startTransition } from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";

export const useObserveAnimationState = () => {
  const [showBlueSky, setShowBlueSky] = useState<boolean>(false);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);
  const sentinelRef = useRef(null);
  const feedRef = useRef(null);

  useEffect(() => {
    if (showBlueSky || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTransition(() => {
            setShowBlueSky(true);
          });
          setShowBlueSky(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [showBlueSky]);

  useEffect(() => {
    if (!feedRef.current) return;

    const startObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTransition(() => {
            setShouldAnimate(true);
          });
        }
      },
      { rootMargin: "300px" },
    );

    const stopObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          startTransition(() => {
            setShouldAnimate(false);
          });
        }
      },
      { rootMargin: "0px" },
    );

    startObserver.observe(feedRef.current);

    return () => {
      startObserver.disconnect();
      stopObserver.disconnect();
    };
  }, []);

  return {
    shouldAnimate,
    showBlueSky,
    sentinelRef,
    feedRef,
  };
};
